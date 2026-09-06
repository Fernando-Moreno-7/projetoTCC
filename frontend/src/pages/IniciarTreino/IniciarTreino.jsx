import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    ArrowLeft,
    Dumbbell,
    CheckCircle
} from "lucide-react";


export default function IniciarTreino() {

    const navigate = useNavigate();

    const [treino, setTreino] = useState(null);
    const [agendaId, setAgendaId] = useState(null);
    const [cargas, setCargas] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [finalizando, setFinalizando] = useState(false);


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


    async function finalizarTreino() {

        console.log("Finalizar Treino clicado");

        if (!treino) {
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
                            item.id
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
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition cursor-pointer"
            >

                <ArrowLeft size={20} />

                Voltar para o Dashboard

            </button>


            <div>

                <h1 className="text-4xl font-bold">
                    {treino.nome}
                </h1>


                <p className="text-gray-500 mt-2 mb-8">

                    {treino.descricao ||
                        "Registre as cargas utilizadas durante o treino."}

                </p>


                <div className="space-y-5">


                    {treino.exercicios.length === 0 && (

                        <div className="bg-white rounded-2xl shadow-md p-8">

                            <p className="text-gray-500">
                                Nenhum exercício cadastrado neste treino.
                            </p>

                        </div>

                    )}


                    {treino.exercicios.map(
                        (item) => (

                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-md p-6"
                            >

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


                                    <div className="flex items-center gap-4">

                                        <div className="bg-purple-100 text-purple-700 p-3 rounded-xl">

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


                                            <p className="text-gray-600 mt-1">

                                                {item.series} séries ×{" "}
                                                {item.repeticoes} repetições

                                            </p>


                                            {item.ultima_carga && (

                                                <p className="text-sm text-gray-500 mt-1">

                                                    Última carga:{" "}
                                                    {item.ultima_carga} kg

                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    <div className="w-full md:w-48">

                                        <label className="block text-sm font-medium text-gray-700 mb-2">

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
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        />

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {treino.exercicios.length > 0 && (

                    <div className="flex justify-end mt-8">

                        <button
                            type="button"
                            onClick={finalizarTreino}
                            disabled={finalizando}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer"
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