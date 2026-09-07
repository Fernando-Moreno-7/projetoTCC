import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    ArrowLeft,
    Dumbbell,
    CheckCircle,
    Timer,
    Play,
    Pause,
    RotateCcw
} from "lucide-react";


export default function IniciarTreino() {

    const navigate = useNavigate();

    const [treino, setTreino] = useState(null);
    const [agendaId, setAgendaId] = useState(null);
    const [cargas, setCargas] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [finalizando, setFinalizando] = useState(false);

    // CRONÔMETRO
    const [tempo, setTempo] = useState(60);
    const [tempoInicial, setTempoInicial] = useState(60);
    const [cronometroAtivo, setCronometroAtivo] = useState(false);


    useEffect(() => {

        async function carregarTreino() {

            try {

                const usuarioId =
                    localStorage.getItem("userId");


                if (!usuarioId) {

                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    navigate("/");

                    return;
                }


                const response = await axios.get(
                    `http://localhost:5000/agenda/usuario/${usuarioId}`
                );


                const dados = response.data;


                if (!dados.agenda || !dados.treino) {

                    alert(
                        "Nenhum treino disponível para iniciar."
                    );

                    navigate("/dashboard");

                    return;
                }


                setAgendaId(dados.agenda.id);


                setTreino({
                    ...dados.treino,
                    exercicios:
                        dados.exercicios || []
                });


                const cargasIniciais = {};


                (dados.exercicios || []).forEach(
                    (item) => {

                        if (item.ultima_carga) {

                            cargasIniciais[item.id] =
                                item.ultima_carga;

                        }

                    }
                );


                setCargas(cargasIniciais);


            } catch (error) {

                console.error(
                    "Erro ao carregar treino:",
                    error
                );


                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar treino!"
                    );

                } else {

                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }


                navigate("/dashboard");


            } finally {

                setCarregando(false);

            }

        }


        carregarTreino();

    }, [navigate]);


    // CONTAGEM REGRESSIVA
    useEffect(() => {

        if (!cronometroAtivo) {
            return;
        }


        if (tempo <= 0) {

            setCronometroAtivo(false);

            return;
        }


        const intervalo = setInterval(() => {

            setTempo(
                (tempoAtual) =>
                    tempoAtual - 1
            );

        }, 1000);


        return () =>
            clearInterval(intervalo);

    }, [cronometroAtivo, tempo]);


    function alterarCarga(
        treinoExercicioId,
        valor
    ) {

        setCargas(
            (cargasAtuais) => ({
                ...cargasAtuais,
                [treinoExercicioId]: valor
            })
        );

    }


    function selecionarTempo(segundos) {

        setTempo(segundos);
        setTempoInicial(segundos);
        setCronometroAtivo(false);

    }


    function iniciarPausarCronometro() {

        if (tempo <= 0) {

            setTempo(tempoInicial);
            setCronometroAtivo(true);

            return;
        }


        setCronometroAtivo(
            (ativoAtual) =>
                !ativoAtual
        );

    }


    function reiniciarCronometro() {

        setCronometroAtivo(false);
        setTempo(tempoInicial);

    }


    function formatarTempo(segundos) {

        const minutos =
            Math.floor(segundos / 60);

        const segundosRestantes =
            segundos % 60;


        return `${String(minutos).padStart(
            2,
            "0"
        )}:${String(segundosRestantes).padStart(
            2,
            "0"
        )}`;

    }


    async function finalizarTreino() {

        if (!treino) {
            return;
        }


        const usuarioId =
            localStorage.getItem("userId");


        if (!usuarioId) {

            alert(
                "Usuário não identificado. Faça login novamente."
            );

            navigate("/");

            return;

        }


        const exerciciosComCarga =
            treino.exercicios.filter(
                (item) =>
                    cargas[item.id] &&
                    Number(cargas[item.id]) > 0
            );


        if (exerciciosComCarga.length === 0) {

            alert(
                "Informe pelo menos uma carga antes de finalizar o treino."
            );

            return;

        }


        const confirmar = window.confirm(
            "Deseja finalizar este treino?"
        );


        if (!confirmar) {
            return;
        }


        try {

            setFinalizando(true);


            for (const item of exerciciosComCarga) {

                await axios.post(
                    "http://localhost:5000/historico-cargas/create",
                    {
                        peso:
                            Number(
                                cargas[item.id]
                            ),

                        treino_exercicios_id:
                            item.id,

                        usuario_id:
                            Number(usuarioId)
                    }
                );

            }


            await axios.post(
                "http://localhost:5000/agenda/finalizar",
                {
                    id: agendaId
                }
            );


            alert(
                "Treino finalizado com sucesso!"
            );


            navigate("/dashboard");


        } catch (error) {

            console.error(
                "Erro ao finalizar treino:",
                error
            );


            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao finalizar treino!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }


        } finally {

            setFinalizando(false);

        }

    }


    if (carregando) {

        return (

            <Layout>

                <p className="text-gray-500">
                    Carregando treino...
                </p>

            </Layout>

        );

    }


    if (!treino) {

        return (

            <Layout>

                <p className="text-gray-500">
                    Nenhum treino disponível.
                </p>

            </Layout>

        );

    }


    return (

        <Layout>

            <button
                type="button"
                onClick={() =>
                    navigate("/dashboard")
                }
                className="mb-6 flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900"
            >

                <ArrowLeft size={20} />

                Voltar para o Dashboard

            </button>


            <div>

                <h1 className="text-4xl font-bold">
                    {treino.nome}
                </h1>


                <p className="mt-2 mb-8 text-gray-500">

                    {treino.descricao ||
                        "Registre as cargas utilizadas durante o treino."}

                </p>


                {/* CRONÔMETRO DE DESCANSO */}

                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

                    <div className="mb-5 flex items-center gap-3">

                        <div className="rounded-xl bg-purple-100 p-3 text-purple-700">

                            <Timer size={26} />

                        </div>


                        <div>

                            <h2 className="text-xl font-bold">
                                Cronômetro de Descanso
                            </h2>

                            <p className="text-sm text-gray-500">
                                Escolha o tempo de descanso entre as séries.
                            </p>

                        </div>

                    </div>


                    <div className="flex flex-col items-center">

                        <p
                            className={`mb-5 text-6xl font-bold ${
                                tempo === 0
                                    ? "text-green-600"
                                    : "text-purple-700"
                            }`}
                        >
                            {formatarTempo(tempo)}
                        </p>


                        {tempo === 0 && (

                            <p className="mb-4 font-semibold text-green-600">
                                Descanso finalizado!
                            </p>

                        )}


                        <div className="mb-5 flex flex-wrap justify-center gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    selecionarTempo(30)
                                }
                                className="cursor-pointer rounded-xl border border-purple-300 px-5 py-2 font-semibold text-purple-700 transition hover:bg-purple-50"
                            >
                                30s
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    selecionarTempo(60)
                                }
                                className="cursor-pointer rounded-xl border border-purple-300 px-5 py-2 font-semibold text-purple-700 transition hover:bg-purple-50"
                            >
                                60s
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    selecionarTempo(90)
                                }
                                className="cursor-pointer rounded-xl border border-purple-300 px-5 py-2 font-semibold text-purple-700 transition hover:bg-purple-50"
                            >
                                90s
                            </button>

                        </div>


                        <div className="flex flex-wrap justify-center gap-3">

                            <button
                                type="button"
                                onClick={
                                    iniciarPausarCronometro
                                }
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800"
                            >

                                {cronometroAtivo ? (
                                    <>
                                        <Pause size={20} />
                                        Pausar
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} />

                                        {tempo === 0
                                            ? "Iniciar novamente"
                                            : tempo === tempoInicial
                                                ? "Iniciar"
                                                : "Continuar"}
                                    </>
                                )}

                            </button>


                            <button
                                type="button"
                                onClick={
                                    reiniciarCronometro
                                }
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
                            >

                                <RotateCcw size={20} />

                                Reiniciar

                            </button>

                        </div>

                    </div>

                </div>


                {/* EXERCÍCIOS */}

                <div className="space-y-5">


                    {treino.exercicios.length === 0 && (

                        <div className="rounded-2xl bg-white p-8 shadow-md">

                            <p className="text-gray-500">
                                Nenhum exercício cadastrado neste treino.
                            </p>

                        </div>

                    )}


                    {treino.exercicios.map(
                        (item) => (

                            <div
                                key={item.id}
                                className="rounded-2xl bg-white p-6 shadow-md"
                            >

                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">


                                    <div className="flex items-center gap-4">

                                        <div className="rounded-xl bg-purple-100 p-3 text-purple-700">

                                            <Dumbbell
                                                size={24}
                                            />

                                        </div>


                                        <div>

                                            <h2 className="text-xl font-bold">

                                                {item.nome ||
                                                    "Exercício"}

                                            </h2>


                                            {item.grupo_muscular && (

                                                <p className="text-gray-500">

                                                    {
                                                        item.grupo_muscular
                                                    }

                                                </p>

                                            )}


                                            <p className="mt-1 text-gray-600">

                                                {item.series} séries ×{" "}
                                                {item.repeticoes} repetições

                                            </p>


                                            {item.ultima_carga && (

                                                <p className="mt-1 text-sm text-gray-500">

                                                    Última carga:{" "}
                                                    {item.ultima_carga} kg

                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    <div className="w-full md:w-48">

                                        <label className="mb-2 block text-sm font-medium text-gray-700">

                                            Carga utilizada (kg)

                                        </label>


                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={
                                                cargas[item.id] ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                alterarCarga(
                                                    item.id,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ex: 50"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                        />

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {treino.exercicios.length > 0 && (

                    <div className="mt-8 flex justify-end">

                        <button
                            type="button"
                            onClick={finalizarTreino}
                            disabled={finalizando}
                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:bg-green-400"
                        >

                            <CheckCircle
                                size={20}
                            />

                            {finalizando
                                ? "Finalizando..."
                                : "Finalizar Treino"}

                        </button>

                    </div>

                )}

            </div>

        </Layout>

    );

}