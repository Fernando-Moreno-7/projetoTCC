
import Layout from "../../components/Layout/Layout";

// Hooks do React para controlar estados e executar ações.
import { useEffect, useState } from "react";

// Hook utilizado para navegar entre as páginas.
import { useNavigate } from "react-router-dom";

// Biblioteca utilizada para fazer requisições ao backend.
import axios from "axios";

// Ícones utilizados na interface.
import {
    CalendarDays,
    Plus,
    Search,
    Pencil,
    Trash2,
    CheckCircle
} from "lucide-react";

export default function Agenda() {

    // Permite redirecionar o usuário para outras páginas.
    const navigate = useNavigate();

    // Armazena a lista de agendamentos recebida do backend.
    const [agendamentos, setAgendamentos] = useState([]);

    // Armazena o texto digitado no campo de pesquisa.
    const [pesquisa, setPesquisa] = useState("");

    // Controla a exibição da mensagem de carregamento.
    const [carregando, setCarregando] = useState(true);

    // Executa a busca dos agendamentos quando a página é montada.
    useEffect(() => {
        buscarAgenda();
    }, []);

    // Busca todos os agendamentos cadastrados no backend.
    async function buscarAgenda() {

        try {

            // Informa que o carregamento começou.
            setCarregando(true);

            // Envia uma requisição GET para buscar os agendamentos.
            const response = await axios.get(
                "http://localhost:5000/agenda/list"
            );

            // Atualiza o estado com os dados recebidos.
            setAgendamentos(response.data);

        } catch (error) {

            // Exibe o erro no console para facilitar a depuração.
            console.error(error);

            // Verifica se o backend retornou uma resposta de erro.
            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao buscar agenda!"
                );

            } else {

                // Exibe esta mensagem se não houver conexão com o servidor.
                alert("Não foi possível conectar ao servidor.");

            }

        } finally {

            // Encerra o estado de carregamento, com ou sem erro.
            setCarregando(false);

        }

    }

    // Marca um agendamento como concluído.
    async function handleFinalizarTreino(id) {

        // Solicita a confirmação do usuário antes de finalizar.
        const confirmar = window.confirm(
            "Deseja marcar este treino como concluído?"
        );

        // Interrompe a função se o usuário clicar em Cancelar.
        if (!confirmar) {
            return;
        }

        try {

            // Envia o ID do agendamento para o backend.
            const response = await axios.post(
                "http://localhost:5000/agenda/finalizar",
                {
                    id
                }
            );

            // Exibe a mensagem retornada pelo backend.
            alert(response.data.message);

            // Atualiza a lista na tela sem precisar recarregar a página.
            setAgendamentos(
                (agendamentosAtuais) =>
                    agendamentosAtuais.map(
                        (agendamento) => {

                            // Localiza o agendamento pelo ID.
                            if (agendamento.id === id) {

                                return {
                                    // Copia os dados existentes do agendamento.
                                    ...agendamento,

                                    // Altera somente o status.
                                    status: "concluido"
                                };

                            }

                            // Mantém os outros agendamentos sem alterações.
                            return agendamento;

                        }
                    )
            );

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao finalizar treino!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }

        }

    }

    // Exclui um agendamento cadastrado.
    async function handleExcluirAgenda(id) {

        // Solicita confirmação antes da exclusão.
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este agendamento?"
        );

        // Cancela a exclusão se o usuário não confirmar.
        if (!confirmar) {
            return;
        }

        try {

            // Envia uma requisição DELETE com o ID do agendamento.
            const response = await axios.delete(
                "http://localhost:5000/agenda/delete",
                {
                    data: {
                        id
                    }
                }
            );

            // Exibe a mensagem de retorno do backend.
            alert(response.data.message);

            // Remove da lista o agendamento que foi excluído.
            setAgendamentos(
                (agendamentosAtuais) =>
                    agendamentosAtuais.filter(
                        (agendamento) =>
                            agendamento.id !== id
                    )
            );

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao excluir agendamento!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }

        }

    }

    // Formata a data para o padrão brasileiro: dia/mês/ano.
    function formatarData(data) {

        // Evita tentar formatar uma data inexistente.
        if (!data) {
            return "";
        }

        // Separa a data do horário recebido do backend.
        const somenteData = data.split("T")[0];

        // Divide a data em ano, mês e dia.
        const [ano, mes, dia] = somenteData.split("-");

        // Retorna a data formatada.
        return `${dia}/${mes}/${ano}`;

    }

    // Converte o status para um texto mais amigável.
    function formatarStatus(status) {

        if (status === "concluido") {
            return "Concluído";
        }

        if (status === "pendente") {
            return "Pendente";
        }

        // Mantém o texto original para outros status.
        return status;

    }

    // Define as cores do status de acordo com seu valor.
    function classeStatus(status) {

        // Verde para treinos concluídos.
        if (status === "concluido") {
            return "bg-green-100 text-green-700";
        }

        // Amarelo para treinos pendentes.
        if (status === "pendente") {
            return "bg-yellow-100 text-yellow-700";
        }

        // Cinza para outros status.
        return "bg-gray-100 text-gray-700";

    }

    // Filtra os agendamentos conforme o texto pesquisado.
    const agendamentosFiltrados = agendamentos.filter(
        (agendamento) => {

            // Remove espaços extras e transforma o texto em minúsculas.
            const textoPesquisa =
                pesquisa.trim().toLowerCase();

            // Obtém o nome do aluno com segurança.
            const nomeAluno =
                agendamento.usuario?.nome
                    ?.toLowerCase() || "";

            // Obtém o nome do treino com segurança.
            const nomeTreino =
                agendamento.treino?.nome
                    ?.toLowerCase() || "";

            // Obtém o status formatado para a pesquisa.
            const status =
                formatarStatus(
                    agendamento.status
                ).toLowerCase();

            // Obtém a data formatada para a pesquisa.
            const data =
                formatarData(
                    agendamento.data
                ).toLowerCase();

            // Mantém o agendamento se algum campo contiver
            // o texto digitado pelo usuário.
            return (
                nomeAluno.includes(textoPesquisa) ||
                nomeTreino.includes(textoPesquisa) ||
                status.includes(textoPesquisa) ||
                data.includes(textoPesquisa)
            );

        }
    );

    // Renderiza a interface da página de agenda.
    return (

        <Layout>

            <div>

                {/* Cabeçalho da página e botão de cadastro. */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">
                            Agenda
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Gerencie os agendamentos de treinos.
                        </p>

                    </div>

                    {/* Redireciona para a tela de novo agendamento. */}
                    <button
                        onClick={() =>
                            navigate("/cadastrar-agenda")
                        }
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition"
                    >

                        <Plus size={20} />

                        Novo Agendamento

                    </button>

                </div>

                {/* Campo de pesquisa dos agendamentos. */}
                <div className="relative mb-8">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={pesquisa}

                        // Atualiza o estado conforme o usuário digita.
                        onChange={(e) =>
                            setPesquisa(e.target.value)
                        }

                        placeholder="Pesquisar por aluno, treino, data ou status..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

                {/* Exibe carregamento, lista vazia ou agendamentos. */}
                {carregando ? (

                    // Mensagem exibida enquanto os dados são buscados.
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                        <p className="text-gray-500">
                            Carregando agenda...
                        </p>

                    </div>

                ) : agendamentosFiltrados.length === 0 ? (

                    // Mensagem exibida quando nenhum agendamento é encontrado.
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                        <CalendarDays
                            size={40}
                            className="mx-auto text-gray-400 mb-3"
                        />

                        <p className="text-gray-500">
                            Nenhum agendamento encontrado.
                        </p>

                    </div>

                ) : (

                    // Lista dos agendamentos encontrados.
                    <div className="space-y-5">

                        {agendamentosFiltrados.map(
                            (agendamento) => (

                                // A key identifica cada item para o React.
                                <div
                                    key={agendamento.id}
                                    className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                                >

                                    {/* Informações do aluno, treino e data. */}
                                    <div>

                                        <h2 className="text-xl font-bold">

                                            {
                                                agendamento.usuario
                                                    ?.nome ||
                                                "Aluno não encontrado"
                                            }

                                        </h2>

                                        <p className="text-gray-500 mt-1">

                                            {
                                                agendamento.treino
                                                    ?.nome ||
                                                "Treino não encontrado"
                                            }

                                            {" • "}

                                            {
                                                formatarData(
                                                    agendamento.data
                                                )
                                            }

                                        </p>

                                    </div>

                                    {/* Status e botões de ações. */}
                                    <div className="flex flex-wrap items-center gap-3">

                                        {/* Mostra o status com a cor correspondente. */}
                                        <span
                                            className={`
                                                px-4
                                                py-2
                                                rounded-full
                                                font-semibold
                                                text-sm
                                                ${classeStatus(
                                                    agendamento.status
                                                )}
                                            `}
                                        >

                                            {
                                                formatarStatus(
                                                    agendamento.status
                                                )
                                            }

                                        </span>

                                        {/* Só mostra Concluir se o treino não estiver concluído. */}
                                        {agendamento.status !== "concluido" && (

                                            <button
                                                onClick={() =>
                                                    handleFinalizarTreino(
                                                        agendamento.id
                                                    )
                                                }
                                                className="flex items-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl font-semibold transition"
                                            >

                                                <CheckCircle size={18} />

                                                Concluir

                                            </button>

                                        )}

                                        {/* Abre a tela de edição do agendamento. */}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/editar-agenda/${agendamento.id}`
                                                )
                                            }
                                            className="flex items-center gap-2 border border-purple-700 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl font-semibold transition"
                                        >

                                            <Pencil size={18} />

                                            Editar

                                        </button>

                                        {/* Solicita a exclusão do agendamento. */}
                                        <button
                                            onClick={() =>
                                                handleExcluirAgenda(
                                                    agendamento.id
                                                )
                                            }
                                            className="flex items-center gap-2 border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition"
                                        >

                                            <Trash2 size={18} />

                                            Excluir

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </Layout>

    );

}
