import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    ArrowLeft,
    Dumbbell,
    CheckCircle,
    Timer,
    Play,
    RotateCcw
} from "lucide-react";

export default function IniciarTreino() {
    const navigate = useNavigate();

    // Dados do treino e do agendamento.
    const [treino, setTreino] = useState(null);
    const [agendaId, setAgendaId] = useState(null);

    // As cargas são associadas ao ID de treino_exercicios.
    const [cargas, setCargas] = useState({});

    const [carregando, setCarregando] = useState(true);
    const [finalizando, setFinalizando] = useState(false);

    // Bloqueia imediatamente tentativas simultâneas de envio.
    const envioEmAndamento = useRef(false);

    // Estados do cronômetro.
    const [tempo, setTempo] = useState(60);
    const [tempoInicial, setTempoInicial] = useState(60);
    const [cronometroAtivo, setCronometroAtivo] = useState(false);

    // Carrega o treino agendado.
    useEffect(() => {
        let ativo = true;
        const controller = new AbortController();

        async function carregarTreino() {
            try {
                const usuarioId = localStorage.getItem("userId");

                if (!usuarioId) {
                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    navigate("/");
                    return;
                }

                const response = await axios.get(
                    `http://localhost:5000/agenda/usuario/${usuarioId}`,
                    { signal: controller.signal }
                );

                if (!ativo) {
                    return;
                }

                const dados = response.data;

                if (!dados.agenda || !dados.treino) {
                    alert("Nenhum treino disponível para iniciar.");
                    navigate("/meu-treino");
                    return;
                }

                if (dados.agenda.status === "concluido") {
                    alert("Este treino já foi concluído!");
                    navigate("/meu-treino");
                    return;
                }

                const exercicios = Array.isArray(dados.exercicios)
                    ? dados.exercicios
                    : [];

                setAgendaId(dados.agenda.id);

                setTreino({
                    ...dados.treino,
                    exercicios
                });

                // Preenche os campos com as últimas cargas.
                const cargasIniciais = {};

                exercicios.forEach((item) => {
                    if (
                        item.ultima_carga !== null &&
                        item.ultima_carga !== undefined
                    ) {
                        cargasIniciais[item.id] = item.ultima_carga;
                    }
                });

                setCargas(cargasIniciais);

            } catch (error) {
                if (!ativo || axios.isCancel(error)) {
                    return;
                }

                console.error("Erro ao carregar treino:", error);

                alert(
                    error.response?.data?.message ||
                    (error.response
                        ? "Erro ao carregar treino!"
                        : "Não foi possível conectar ao servidor.")
                );

                navigate("/meu-treino");

            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarTreino();

        // Cancela a consulta ao sair da página.
        return () => {
            ativo = false;
            controller.abort();
        };
    }, [navigate]);

    // Diminui o tempo enquanto o cronômetro está ativo.
    useEffect(() => {
        if (!cronometroAtivo) {
            return;
        }

        const intervalo = setInterval(() => {
            setTempo((tempoAtual) => Math.max(0, tempoAtual - 1));
        }, 1000);

        return () => clearInterval(intervalo);
    }, [cronometroAtivo]);

    // Interrompe a contagem ao chegar a zero.
    useEffect(() => {
        if (tempo === 0) {
            setCronometroAtivo(false);
        }
    }, [tempo]);

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

        setCronometroAtivo((ativoAtual) => !ativoAtual);
    }

    function reiniciarCronometro() {
        setCronometroAtivo(false);
        setTempo(tempoInicial);
    }

    function formatarTempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;

        return `${String(minutos).padStart(2, "0")}:${String(
            segundosRestantes
        ).padStart(2, "0")}`;
    }

    function alterarCarga(treinoExercicioId, valor) {
        setCargas((cargasAtuais) => ({
            ...cargasAtuais,
            [treinoExercicioId]: valor
        }));
    }

    // Envia as cargas e o agendamento juntos.
    async function finalizarTreino() {
        if (!treino || envioEmAndamento.current) {
            return;
        }

        if (
            !Number.isSafeInteger(Number(agendaId)) ||
            Number(agendaId) <= 0
        ) {
            alert("Agendamento não identificado. Atualize a página.");
            return;
        }

        const exercicios = Array.isArray(treino.exercicios)
            ? treino.exercicios
            : [];

        const cargasParaEnviar = [];

        for (const item of exercicios) {
            const valor = cargas[item.id];

            // Campos vazios não são enviados.
            if (
                valor === null ||
                valor === undefined ||
                String(valor).trim() === ""
            ) {
                continue;
            }

            const peso = Number(valor);

            // Valida explicitamente porque o botão não envia um form.
            if (
                !Number.isSafeInteger(peso) ||
                peso <= 0 ||
                peso > 2147483647
            ) {
                alert(
                    `Informe uma carga inteira maior que zero para ${
                        item.nome || "o exercício"
                    }.`
                );

                return;
            }

            cargasParaEnviar.push({
                treino_exercicios_id: Number(item.id),
                peso
            });
        }

        if (cargasParaEnviar.length === 0) {
            alert(
                "Informe pelo menos uma carga antes de finalizar o treino."
            );

            return;
        }

        if (!window.confirm("Deseja finalizar este treino?")) {
            return;
        }

        envioEmAndamento.current = true;
        setFinalizando(true);

        try {
            // O backend salva tudo na mesma transação.
            // Não há mais POST separado para cada carga.
            await axios.post(
                "http://localhost:5000/agenda/finalizar",
                {
                    id: Number(agendaId),
                    cargas: cargasParaEnviar
                }
            );

            setCronometroAtivo(false);

            alert("Treino finalizado com sucesso!");
            navigate("/dashboard");

        } catch (error) {
            console.error("Erro ao finalizar treino:", error);

            if (error.response) {
                alert(
                    error.response.data?.message ||
                    "Erro ao finalizar treino!"
                );

                // Pode ocorrer se outra aba já concluiu o agendamento.
                if (error.response.status === 409) {
                    navigate("/meu-treino");
                }
            } else {
                // Sem resposta, não é possível afirmar se houve commit.
                alert(
                    "Não foi possível confirmar a finalização. " +
                    "Verifique o status em Meu Treino antes de tentar novamente."
                );
            }

        } finally {
            envioEmAndamento.current = false;
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

    const exercicios = Array.isArray(treino.exercicios)
        ? treino.exercicios
        : [];

    return (
        <Layout>
            <button
                type="button"
                onClick={() => navigate("/meu-treino")}
                disabled={finalizando}
                className="mb-6 flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900 disabled:opacity-50"
            >
                <ArrowLeft size={20} />
                Voltar para Meu Treino
            </button>

            <div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                    {treino.nome}
                </h1>

                <p className="mt-2 mb-8 text-gray-500">
                    {treino.descricao ||
                        "Registre as cargas utilizadas durante o treino."}
                </p>

                {/* Cronômetro de descanso */}
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="shrink-0 rounded-xl bg-purple-100 p-3 text-purple-700">
                            <Timer size={26} />
                        </div>

                        <div className="min-w-0">
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
                            <p
                                role="status"
                                className="mb-4 font-semibold text-green-600"
                            >
                                Descanso finalizado!
                            </p>
                        )}

                        <div className="mb-5 flex flex-wrap justify-center gap-3">
                            {[30, 60, 90].map((segundos) => (
                                <button
                                    key={segundos}
                                    type="button"
                                    onClick={() => selecionarTempo(segundos)}
                                    className="min-h-11 cursor-pointer rounded-xl border border-purple-300 px-5 py-2 font-semibold text-purple-700 transition hover:bg-purple-50"
                                >
                                    {segundos}s
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                type="button"
                                onClick={iniciarPausarCronometro}
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800"
                            >
                                <Play size={20} />

                                <span>
                                    {cronometroAtivo
                                        ? "Pausar"
                                        : tempo === 0
                                            ? "Iniciar novamente"
                                            : tempo === tempoInicial
                                                ? "Iniciar"
                                                : "Continuar"}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={reiniciarCronometro}
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
                            >
                                <RotateCcw size={20} />
                                Reiniciar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Exercícios e cargas */}
                <div className="space-y-5">
                    {exercicios.length === 0 && (
                        <div className="rounded-2xl bg-white p-8 shadow-md">
                            <p className="text-gray-500">
                                Nenhum exercício cadastrado neste treino.
                            </p>
                        </div>
                    )}

                    {exercicios.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl bg-white p-6 shadow-md"
                        >
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="shrink-0 rounded-xl bg-purple-100 p-3 text-purple-700">
                                        <Dumbbell size={24} />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-xl font-bold break-words">
                                            {item.nome || "Exercício"}
                                        </h2>

                                        {item.grupo_muscular && (
                                            <p className="text-gray-500">
                                                {item.grupo_muscular}
                                            </p>
                                        )}

                                        <p className="mt-1 text-gray-600">
                                            {item.series} séries ×{" "}
                                            {item.repeticoes} repetições
                                        </p>

                                        {item.ultima_carga !== null &&
                                            item.ultima_carga !== undefined && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Última carga:{" "}
                                                    {item.ultima_carga} kg
                                                </p>
                                            )}
                                    </div>
                                </div>

                                <div className="w-full shrink-0 md:w-48">
                                    <label
                                        htmlFor={`carga-${item.id}`}
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Carga utilizada (kg)
                                    </label>

                                    <input
                                        id={`carga-${item.id}`}
                                        type="number"
                                        min="1"
                                        max="2147483647"
                                        step="1"
                                        value={cargas[item.id] ?? ""}
                                        onChange={(event) =>
                                            alterarCarga(
                                                item.id,
                                                event.target.value
                                            )
                                        }
                                        disabled={finalizando}
                                        placeholder="Ex: 50"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {exercicios.length > 0 && (
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={finalizarTreino}
                            disabled={finalizando}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400 sm:w-auto"
                        >
                            <CheckCircle size={20} />

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