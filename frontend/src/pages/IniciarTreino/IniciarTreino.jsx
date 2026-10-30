
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

// Ícones utilizados na página.
import {
    ArrowLeft,
    Dumbbell,
    CheckCircle,
    Timer,
    Play,
    RotateCcw
} from "lucide-react";

export default function IniciarTreino() {

    // Permite navegar entre as páginas do aplicativo.
    const navigate = useNavigate();

    // Armazena os dados do treino recebido do backend.
    const [treino, setTreino] = useState(null);

    // Guarda o ID do agendamento que será finalizado.
    const [agendaId, setAgendaId] = useState(null);

    // Armazena as cargas utilizadas em cada exercício.
    // Cada carga é associada ao ID do exercício do treino.
    const [cargas, setCargas] = useState({});

    // Controla o carregamento inicial da página.
    const [carregando, setCarregando] = useState(true);

    // Indica se a finalização está em andamento.
    const [finalizando, setFinalizando] = useState(false);

    // =========================================
    // ESTADOS DO CRONÔMETRO
    // =========================================

    // Tempo restante, inicialmente 60 segundos.
    const [tempo, setTempo] = useState(60);

    // Tempo escolhido pelo aluno para o descanso.
    const [tempoInicial, setTempoInicial] = useState(60);

    // Controla se o cronômetro está ativo ou pausado.
    const [cronometroAtivo, setCronometroAtivo] = useState(false);

    // =========================================
    // CARREGAR TREINO
    // =========================================

    // Executa o carregamento quando o componente é montado.
    useEffect(() => {

        // Função assíncrona que consulta o backend.
        async function carregarTreino() {

            try {

                // Recupera o ID armazenado durante o login.
                const usuarioId =
                    localStorage.getItem("userId");

                // Verifica se o usuário foi identificado.
                if (!usuarioId) {

                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    // Redireciona para o login.
                    navigate("/");

                    // Interrompe a execução da função.
                    return;
                }

                // Busca o treino agendado para o usuário.
                // O ID é enviado como parâmetro na URL.
                const response = await axios.get(
                    `http://localhost:5000/agenda/usuario/${usuarioId}`
                );

                // Armazena os dados retornados pelo backend.
                const dados = response.data;

                // Verifica se existe uma agenda E um treino.
                // || significa OU: basta um deles estar ausente.
                if (!dados.agenda || !dados.treino) {

                    alert(
                        "Nenhum treino disponível para iniciar."
                    );

                    navigate("/meu-treino");
                    return;
                }

                // Impede que o aluno inicie um treino
                // cujo agendamento já está concluído.
                if (dados.agenda.status === "concluido") {

                    alert(
                        "Este treino já foi concluído!"
                    );

                    navigate("/meu-treino");
                    return;
                }

                // Verifica se os exercícios são um array.
                // Se não forem, utiliza um array vazio.
                const exercicios =
                    Array.isArray(dados.exercicios)
                        ? dados.exercicios
                        : [];

                // Guarda o ID do agendamento.
                setAgendaId(dados.agenda.id);

                // Atualiza o estado do treino.
                // O spread copia as propriedades recebidas.
                // Depois, adiciona a lista de exercícios.
                setTreino({
                    ...dados.treino,
                    exercicios
                });

                // Objeto que armazenará as últimas cargas.
                const cargasIniciais = {};

                // Percorre cada exercício da lista.
                exercicios.forEach((item) => {

                    // Verifica se existe uma carga anterior.
                    if (
                        item.ultima_carga !== null &&
                        item.ultima_carga !== undefined
                    ) {

                        // Associa a última carga ao ID do exercício.
                        cargasIniciais[item.id] =
                            item.ultima_carga;
                    }
                });

                // Preenche o estado com as cargas anteriores.
                setCargas(cargasIniciais);

            } catch (error) {

                // Registra o erro para facilitar a depuração.
                console.error(
                    "Erro ao carregar treino:",
                    error
                );

                // Verifica se o backend retornou um erro HTTP.
                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar treino!"
                    );

                } else {

                    // Falha sem resposta HTTP.
                    alert(
                        "Não foi possível conectar ao servidor."
                    );
                }

                navigate("/meu-treino");

            } finally {

                // Finaliza o carregamento mesmo em caso de erro.
                setCarregando(false);
            }
        }

        // Chama a função para carregar os dados.
        carregarTreino();

    }, [navigate]);

    // =========================================
    // CRONÔMETRO
    // =========================================

    useEffect(() => {

        // Se o cronômetro não estiver ativo,
        // não cria o intervalo.
        if (!cronometroAtivo) {
            return;
        }

        // Executa uma função a cada 1000 milissegundos.
        // 1000 milissegundos equivalem a 1 segundo.
        const intervalo = setInterval(() => {

            // Atualiza o tempo usando o valor anterior.
            setTempo((tempoAtual) => {

                // Quando chega ao último segundo,
                // desativa o cronômetro e retorna zero.
                if (tempoAtual <= 1) {

                    setCronometroAtivo(false);
                    return 0;
                }

                // Diminui um segundo.
                return tempoAtual - 1;
            });

        }, 1000);

        // Limpa o intervalo ao pausar o cronômetro
        // ou desmontar o componente.
        return () => {
            clearInterval(intervalo);
        };

    }, [cronometroAtivo]);

    // =========================================
    // SELECIONAR TEMPO DE DESCANSO
    // =========================================

    function selecionarTempo(segundos) {

        // Atualiza o tempo restante.
        setTempo(segundos);

        // Guarda o tempo escolhido para reiniciar depois.
        setTempoInicial(segundos);

        // Deixa o cronômetro pausado.
        setCronometroAtivo(false);
    }

    // =========================================
    // INICIAR OU PAUSAR CRONÔMETRO
    // =========================================

    function iniciarPausarCronometro() {

        // Se o tempo terminou, restaura o valor inicial
        // e inicia uma nova contagem.
        if (tempo <= 0) {

            setTempo(tempoInicial);
            setCronometroAtivo(true);
            return;
        }

        // Inverte o estado booleano.
        // true vira false; false vira true.
        setCronometroAtivo(
            (ativoAtual) => !ativoAtual
        );
    }

    // =========================================
    // REINICIAR CRONÔMETRO
    // =========================================

    function reiniciarCronometro() {

        // Pausa a contagem.
        setCronometroAtivo(false);

        // Restaura o tempo selecionado pelo aluno.
        setTempo(tempoInicial);
    }

    // =========================================
    // FORMATAR TEMPO
    // =========================================

    function formatarTempo(segundos) {

        // Calcula os minutos inteiros.
        // Math.floor arredonda para baixo.
        const minutos =
            Math.floor(segundos / 60);

        // % calcula o resto da divisão por 60.
        const segundosRestantes =
            segundos % 60;

        // padStart adiciona zero à esquerda.
        // Exemplo: 90 segundos se torna 01:30.
        return `${String(minutos).padStart(
            2,
            "0"
        )}:${String(segundosRestantes).padStart(
            2,
            "0"
        )}`;
    }

    // =========================================
    // ALTERAR CARGA DE UM EXERCÍCIO
    // =========================================

    function alterarCarga(
        treinoExercicioId,
        valor
    ) {

        // Atualiza a carga do exercício selecionado.
        setCargas(
            (cargasAtuais) => ({

                // Mantém os pesos dos outros exercícios.
                ...cargasAtuais,

                // Atualiza somente o exercício correspondente.
                [treinoExercicioId]: valor
            })
        );
    }

    // =========================================
    // FINALIZAR TREINO
    // =========================================

    async function finalizarTreino() {

        // Impede a execução se não houver treino.
        if (!treino) {
            return;
        }

        // Recupera o ID do usuário.
        const usuarioId =
            localStorage.getItem("userId");

        // Valida se o usuário está identificado.
        if (!usuarioId) {

            alert(
                "Usuário não identificado. Faça login novamente."
            );

            navigate("/");
            return;
        }

        // Garante que os exercícios sejam um array.
        const exercicios =
            Array.isArray(treino.exercicios)
                ? treino.exercicios
                : [];

        // Seleciona os exercícios com cargas válidas.
        const exerciciosComCarga =
            exercicios.filter(
                (item) =>
                    cargas[item.id] &&
                    Number(cargas[item.id]) > 0
            );

        // Exige pelo menos uma carga válida.
        if (exerciciosComCarga.length === 0) {

            alert(
                "Informe pelo menos uma carga antes de finalizar o treino."
            );

            return;
        }

        // Solicita confirmação antes de finalizar.
        const confirmar = window.confirm(
            "Deseja finalizar este treino?"
        );

        // Cancela a operação se o aluno não confirmar.
        if (!confirmar) {
            return;
        }

        try {

            // Indica que a finalização começou.
            setFinalizando(true);

            // Percorre os exercícios com cargas válidas.
            for (const item of exerciciosComCarga) {

                // Envia cada carga ao backend.
                // await aguarda a conclusão da requisição.
                await axios.post(
                    "http://localhost:5000/historico-cargas/create",
                    {
                        // Peso utilizado no exercício.
                        peso:
                            Number(
                                cargas[item.id]
                            ),

                        // ID da relação entre treino e exercício.
                        treino_exercicios_id:
                            item.id,

                        // ID do aluno.
                        usuario_id:
                            Number(usuarioId)
                    }
                );
            }

            // Depois de registrar as cargas,
            // solicita a finalização do agendamento.
            await axios.post(
                "http://localhost:5000/agenda/finalizar",
                {
                    id: agendaId
                }
            );

            // Exibe a confirmação de sucesso.
            alert(
                "Treino finalizado com sucesso!"
            );

            // Redireciona para o dashboard.
            navigate("/dashboard");

        } catch (error) {

            // Registra o erro no console.
            console.error(
                "Erro ao finalizar treino:",
                error
            );

            // Mostra a mensagem do backend quando disponível.
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

            // Libera novamente o botão de finalização.
            setFinalizando(false);
        }
    }

    // =========================================
    // TELA DE CARREGAMENTO
    // =========================================

    // Enquanto os dados estão sendo buscados,
    // apresenta uma mensagem ao aluno.
    if (carregando) {

        return (
            <Layout>
                <p className="text-gray-500">
                    Carregando treino...
                </p>
            </Layout>
        );
    }

    // =========================================
    // TELA SEM TREINO
    // =========================================

    // Caso não exista treino carregado,
    // apresenta uma mensagem.
    if (!treino) {

        return (
            <Layout>
                <p className="text-gray-500">
                    Nenhum treino disponível.
                </p>
            </Layout>
        );
    }

    // Garante uma lista válida para renderização.
    const exercicios =
        Array.isArray(treino.exercicios)
            ? treino.exercicios
            : [];

    // =========================================
    // INTERFACE PRINCIPAL
    // =========================================

    return (

        <Layout>

            {/* BOTÃO VOLTAR */}

            <button
                type="button"
                onClick={() =>
                    navigate("/meu-treino")
                }
                className="mb-6 flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900"
            >
                <ArrowLeft size={20} />
                Voltar para Meu Treino
            </button>

            <div>

                {/* NOME DO TREINO */}

                <h1 className="text-4xl font-bold">
                    {treino.nome}
                </h1>

                {/* Mostra a descrição do treino.
                    Se não existir, apresenta um texto padrão. */}

                <p className="mt-2 mb-8 text-gray-500">
                    {treino.descricao ||
                        "Registre as cargas utilizadas durante o treino."}
                </p>

                {/* =====================================
                    CRONÔMETRO DE DESCANSO
                    ===================================== */}

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

                        {/* EXIBIÇÃO DO TEMPO */}

                        {/* Quando chega a zero, o texto fica verde.
                            Caso contrário, permanece roxo. */}

                        <p
                            className={`mb-5 text-6xl font-bold ${
                                tempo === 0
                                    ? "text-green-600"
                                    : "text-purple-700"
                            }`}
                        >
                            {formatarTempo(tempo)}
                        </p>

                        {/* Mensagem exibida quando o tempo termina. */}

                        {tempo === 0 && (

                            <p className="mb-4 font-semibold text-green-600">
                                Descanso finalizado!
                            </p>

                        )}

                        {/* BOTÕES DE SELEÇÃO DO TEMPO */}

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

                        {/* BOTÕES DE CONTROLE DO CRONÔMETRO */}

                        <div className="flex flex-wrap justify-center gap-3">

                            {/* INICIAR / PAUSAR / CONTINUAR */}

                            <button
                                type="button"
                                onClick={
                                    iniciarPausarCronometro
                                }
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800"
                            >

                                <Play size={20} />

                                {/* O texto muda conforme o estado
                                    atual do cronômetro. */}

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

                            {/* REINICIAR */}

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

                {/* =====================================
                    LISTAGEM DOS EXERCÍCIOS
                    ===================================== */}

                <div className="space-y-5">

                    {/* Mensagem caso não existam exercícios. */}

                    {exercicios.length === 0 && (

                        <div className="rounded-2xl bg-white p-8 shadow-md">

                            <p className="text-gray-500">
                                Nenhum exercício cadastrado neste treino.
                            </p>

                        </div>

                    )}

                    {/* map percorre os exercícios
                        e cria um card para cada um. */}

                    {exercicios.map(
                        (item) => (

                            <div
                                // Identificador único para o React.
                                key={item.id}
                                className="rounded-2xl bg-white p-6 shadow-md"
                            >

                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                    {/* INFORMAÇÕES DO EXERCÍCIO */}

                                    <div className="flex items-center gap-4">

                                        <div className="rounded-xl bg-purple-100 p-3 text-purple-700">

                                            <Dumbbell
                                                size={24}
                                            />

                                        </div>

                                        <div>

                                            {/* Nome do exercício. */}

                                            <h2 className="text-xl font-bold">
                                                {item.nome ||
                                                    "Exercício"}
                                            </h2>

                                            {/* Exibe o grupo muscular
                                                somente se ele existir. */}

                                            {item.grupo_muscular && (

                                                <p className="text-gray-500">
                                                    {item.grupo_muscular}
                                                </p>

                                            )}

                                            {/* Séries e repetições. */}

                                            <p className="mt-1 text-gray-600">
                                                {item.series} séries ×{" "}
                                                {item.repeticoes} repetições
                                            </p>

                                            {/* Mostra a última carga
                                                quando há valor registrado. */}

                                            {item.ultima_carga !== null &&
                                                item.ultima_carga !== undefined && (

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Última carga:{" "}
                                                        {item.ultima_carga} kg
                                                    </p>

                                                )}

                                        </div>

                                    </div>

                                    {/* CAMPO PARA REGISTRAR A CARGA */}

                                    <div className="w-full md:w-48">

                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Carga utilizada (kg)
                                        </label>

                                        <input
                                            // Campo numérico.
                                            type="number"

                                            // Valor mínimo informado na interface.
                                            min="1"

                                            // Incremento de uma unidade.
                                            step="1"

                                            // Valor controlado pelo estado cargas.
                                            // ?? "" usa texto vazio se o valor
                                            // for null ou undefined.
                                            value={
                                                cargas[item.id] ?? ""
                                            }

                                            // Atualiza a carga quando
                                            // o aluno digita um valor.
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

                {/* =====================================
                    BOTÃO FINALIZAR TREINO
                    ===================================== */}

                {/* Só aparece quando existem exercícios. */}

                {exercicios.length > 0 && (

                    <div className="mt-8 flex justify-end">

                        <button
                            type="button"

                            // Executa a função de finalização.
                            onClick={finalizarTreino}

                            // Impede novos cliques enquanto
                            // a finalização está em andamento.
                            disabled={finalizando}

                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700 disabled:bg-green-400"
                        >

                            <CheckCircle size={20} />

                            {/* Altera o texto durante a operação. */}

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
