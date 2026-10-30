
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Componente responsável pela estrutura visual da página.
import Layout from "../../components/Layout/Layout";

// Ícones utilizados na interface.
import {
    Dumbbell,
    Play,
    CalendarDays
} from "lucide-react";

// Componente responsável pela página "Meu Treino".
export default function MeuTreino() {

    // Permite navegar entre as páginas do EvolutionFit.
    const navigate = useNavigate();

    // =========================================
    // ESTADOS DO COMPONENTE
    // =========================================

    // Armazena os dados do treino recebido do backend.
    const [treino, setTreino] = useState(null);

    // Armazena as informações do agendamento.
    const [agenda, setAgenda] = useState(null);

    // Armazena a lista de exercícios do treino.
    // Começa como um array vazio.
    const [exercicios, setExercicios] = useState([]);

    // Controla se a página ainda está carregando.
    // Começa como true porque os dados ainda não foram buscados.
    const [carregando, setCarregando] = useState(true);

    // =========================================
    // CARREGAR TREINO DO ALUNO
    // =========================================

    // Executa o efeito quando o componente é montado.
    useEffect(() => {

        // Função assíncrona responsável por buscar os dados.
        async function carregarTreino() {

            try {

                // Recupera o ID do usuário armazenado
                // no navegador durante o login.
                const usuarioId =
                    localStorage.getItem("userId");

                // Verifica se o usuário foi identificado.
                if (!usuarioId) {

                    // Informa que o usuário precisa fazer login.
                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    // Redireciona para a página de login.
                    navigate("/");

                    // Interrompe a execução da função.
                    return;
                }

                // Faz uma requisição GET ao backend.
                // O usuarioId permite buscar o treino
                // agendado para o aluno correspondente.
                const response = await axios.get(
                    `http://localhost:5000/agenda/usuario/${usuarioId}`
                );

                // Atualiza o estado com os dados do agendamento.
                setAgenda(response.data.agenda);

                // Atualiza o estado com os dados do treino.
                setTreino(response.data.treino);

                // Atualiza a lista de exercícios.
                // Caso não exista uma lista, utiliza [].
                setExercicios(
                    response.data.exercicios || []
                );

            } catch (error) {

                // Mostra o erro no console para depuração.
                console.error(error);

                // Verifica se o backend retornou status 404.
                // O ?. evita erro caso response não exista.
                if (error.response?.status === 404) {

                    // Limpa os dados quando o recurso
                    // solicitado não é encontrado.
                    setTreino(null);
                    setAgenda(null);
                    setExercicios([]);

                } else {

                    // Exibe a mensagem enviada pelo backend.
                    // Se não existir, utiliza uma mensagem padrão.
                    alert(
                        error.response?.data?.message ||
                        "Erro ao carregar treino!"
                    );
                }

            } finally {

                // Executa mesmo se a requisição falhar.
                // Encerra o estado de carregamento.
                setCarregando(false);
            }
        }

        // Executa a função ao carregar a página.
        carregarTreino();

    }, [navigate]);

    // =========================================
    // FORMATAR DATA
    // =========================================

    function formatarData(data) {

        // Verifica se a data não foi informada.
        if (!data) {
            return "Não informada";
        }

        // Converte o valor recebido em uma data.
        // Exibe no formato brasileiro: dia/mês/ano.
        // O UTC é utilizado na formatação para
        // evitar deslocamentos de data por fuso horário.
        return new Date(data).toLocaleDateString(
            "pt-BR",
            {
                timeZone: "UTC"
            }
        );
    }

    // =========================================
    // FORMATAR STATUS
    // =========================================

    function formatarStatus(status) {

        // Transforma "pendente" em um texto para exibição.
        if (status === "pendente") {
            return "Pendente";
        }

        // Transforma "concluido" em um texto com acento.
        if (status === "concluido") {
            return "Concluído";
        }

        // Retorna o valor original para outros status.
        return status;
    }

    // =========================================
    // DEFINIR CORES DO STATUS
    // =========================================

    function classeStatus(status) {

        // Se o treino estiver concluído,
        // utiliza fundo verde-claro e texto verde-escuro.
        if (status === "concluido") {
            return "bg-green-100 text-green-700";
        }

        // Para os demais status, utiliza amarelo.
        return "bg-yellow-100 text-yellow-700";
    }

    // =========================================
    // TELA DE CARREGAMENTO
    // =========================================

    // Enquanto carregando for true,
    // apresenta somente a mensagem de carregamento.
    if (carregando) {

        return (
            <Layout>
                <p className="text-gray-500">
                    Carregando seu treino...
                </p>
            </Layout>
        );
    }

    // =========================================
    // INTERFACE PRINCIPAL
    // =========================================

    return (

        // Layout mantém a estrutura visual do aplicativo.
        <Layout>

            <div>

                {/* TÍTULO DA PÁGINA */}

                <h1 className="mb-2 text-4xl font-bold">
                    Meu Treino
                </h1>

                {/* DESCRIÇÃO DA PÁGINA */}

                <p className="mb-8 text-gray-500">
                    Veja os exercícios do seu treino.
                </p>

                {/* =====================================
                    VERIFICAR SE EXISTE TREINO
                    ===================================== */}

                {/* O operador ! verifica se treino não existe.
                    O ternário mostra uma das duas interfaces. */}

                {!treino ? (

                    // Caso não exista treino,
                    // apresenta uma mensagem informativa.
                    <div className="rounded-2xl bg-white p-8 shadow-md">

                        <Dumbbell
                            size={38}
                            className="mb-4 text-purple-700"
                        />

                        <h2 className="text-2xl font-bold">
                            Nenhum treino encontrado
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Você não possui um treino agendado para hoje.
                        </p>

                    </div>

                ) : (

                    // Se existir treino, apresenta os dados.
                    // Fragment <> permite agrupar elementos.
                    <>

                        {/* =====================================
                            CARD COM INFORMAÇÕES DO TREINO
                            ===================================== */}

                        <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    {/* NOME E ÍCONE DO TREINO */}

                                    <div className="mb-2 flex items-center gap-3">

                                        <Dumbbell
                                            size={28}
                                            className="text-purple-700"
                                        />

                                        {/* Nome retornado pelo backend. */}

                                        <h2 className="text-2xl font-bold">
                                            {treino.nome}
                                        </h2>

                                    </div>

                                    {/* O && exibe a descrição
                                        somente se ela existir. */}

                                    {treino.descricao && (

                                        <p className="text-gray-500">
                                            {treino.descricao}
                                        </p>

                                    )}

                                </div>

                                {/* =====================================
                                    STATUS DO AGENDAMENTO
                                    ===================================== */}

                                {/* O ?. evita erro caso agenda seja null.
                                    O status só aparece quando existe. */}

                                {agenda?.status && (

                                    <span
                                        // Aplica classes fixas e
                                        // as cores retornadas pela função.
                                        className={`
                                            rounded-full
                                            px-3
                                            py-1
                                            text-sm
                                            font-semibold
                                            ${classeStatus(
                                                agenda.status
                                            )}
                                        `}
                                    >

                                        {/* Formata o texto do status. */}

                                        {formatarStatus(
                                            agenda.status
                                        )}

                                    </span>

                                )}

                            </div>

                            {/* =====================================
                                DATA DO AGENDAMENTO
                                ===================================== */}

                            <div className="mt-5 flex items-center gap-2 text-gray-600">

                                <CalendarDays size={18} />

                                <span>
                                    Data:{" "}
                                    {formatarData(
                                        agenda?.data
                                    )}
                                </span>

                            </div>

                        </div>

                        {/* =====================================
                            CARD DE EXERCÍCIOS
                            ===================================== */}

                        <div className="rounded-2xl bg-white p-6 shadow-md">

                            <h2 className="mb-5 text-2xl font-bold">
                                Exercícios
                            </h2>

                            {/* Verifica se a lista está vazia.
                                length representa a quantidade
                                de elementos do array. */}

                            {exercicios.length === 0 ? (

                                // Mensagem para treino sem exercícios.
                                <p className="text-gray-500">
                                    Nenhum exercício cadastrado neste treino.
                                </p>

                            ) : (

                                // Se existirem exercícios,
                                // apresenta a lista.
                                <div className="space-y-4">

                                    {/* map percorre o array
                                        e gera um card para cada exercício. */}

                                    {exercicios.map(
                                        (item, index) => (

                                            <div
                                                // ID único usado pelo React
                                                // para identificar o elemento.
                                                key={item.id}
                                                className="rounded-xl border border-gray-200 p-5"
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    {/* INFORMAÇÕES DO EXERCÍCIO */}

                                                    <div>

                                                        {/* index começa em zero.
                                                            +1 faz a numeração
                                                            começar em um. */}

                                                        <p className="mb-1 text-sm font-semibold text-purple-700">
                                                            Exercício{" "}
                                                            {index + 1}
                                                        </p>

                                                        {/* Nome do exercício. */}

                                                        <h3 className="text-xl font-bold">
                                                            {item.nome}
                                                        </h3>

                                                        {/* Grupo muscular só
                                                            aparece se existir. */}

                                                        {item.grupo_muscular && (

                                                            <p className="mt-1 text-gray-500">
                                                                {item.grupo_muscular}
                                                            </p>

                                                        )}

                                                    </div>

                                                    {/* SÉRIES E REPETIÇÕES */}

                                                    <div className="text-right">

                                                        <p className="font-semibold">
                                                            {item.series} ×{" "}
                                                            {item.repeticoes}
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            séries × repetições
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* =====================================
                                                    ÚLTIMA CARGA REGISTRADA
                                                    ===================================== */}

                                                {/* Verifica se existe uma carga.
                                                    Se for null ou undefined,
                                                    não apresenta essa informação. */}

                                                {item.ultima_carga !== null &&
                                                    item.ultima_carga !== undefined && (

                                                        <div className="mt-4">

                                                            <span className="text-sm text-gray-500">
                                                                Última carga:
                                                            </span>

                                                            <span className="ml-2 font-semibold">
                                                                {item.ultima_carga} kg
                                                            </span>

                                                        </div>

                                                    )}

                                                {/* =====================================
                                                    DESCRIÇÃO DO EXERCÍCIO
                                                    ===================================== */}

                                                {/* Mostra a descrição
                                                    somente quando existir. */}

                                                {item.descricao && (

                                                    <p className="mt-4 text-gray-600">
                                                        {item.descricao}
                                                    </p>

                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                            {/* =====================================
                                BOTÃO INICIAR TREINO
                                ===================================== */}

                            {/* O botão aparece somente quando:
                                1. Existe pelo menos um exercício;
                                2. O status não é "concluido". */}

                            {exercicios.length > 0 &&
                                agenda?.status !== "concluido" && (

                                    <button
                                        type="button"

                                        // Ao clicar, navega para
                                        // a página de execução do treino.
                                        onClick={() =>
                                            navigate(
                                                "/iniciar-treino"
                                            )
                                        }

                                        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-800"
                                    >

                                        <Play size={20} />

                                        Iniciar Treino

                                    </button>

                                )}

                        </div>

                    </>

                )}

            </div>

        </Layout>

    );
}
