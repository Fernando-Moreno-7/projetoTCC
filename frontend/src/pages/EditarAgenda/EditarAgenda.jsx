
import Layout from "../../components/Layout/Layout";

// Hooks do React para estados e efeitos
import { useEffect, useState } from "react";

// Hooks para navegação e parâmetros da URL
import { useNavigate, useParams } from "react-router-dom";

// Biblioteca para requisições HTTP
import axios from "axios";

// Ícones utilizados na interface
import {
    ArrowLeft,
    User,
    Dumbbell,
    CalendarDays
} from "lucide-react";

// Componente responsável por editar um agendamento
export default function EditarAgenda() {

    // Permite navegar entre as páginas
    const navigate = useNavigate();

    // Captura o ID do agendamento pela URL
    const { id } = useParams();

    // Listas de alunos e treinos recebidas do backend
    const [alunos, setAlunos] = useState([]);
    const [treinos, setTreinos] = useState([]);

    // Estados dos campos do formulário
    const [usuarioId, setUsuarioId] = useState("");
    const [treinoId, setTreinoId] = useState("");
    const [data, setData] = useState("");
    const [status, setStatus] = useState("pendente");

    // Controla o carregamento inicial dos dados
    const [carregando, setCarregando] = useState(true);

    // Controla o processo de salvamento
    const [salvando, setSalvando] = useState(false);

    // =========================================
    // CARREGAR DADOS DO AGENDAMENTO
    // =========================================

    // Executa quando a tela é aberta ou as dependências mudam
    useEffect(() => {

        // Função assíncrona para buscar os dados necessários
        async function carregarDados() {

            try {

                // Executa três requisições simultaneamente
                // e aguarda todas serem concluídas
                const [
                    responseAgenda,
                    responseAlunos,
                    responseTreinos
                ] = await Promise.all([

                    // Busca o agendamento pelo ID
                    axios.get(
                        `http://localhost:5000/agenda/${id}`
                    ),

                    // Busca todos os alunos
                    axios.get(
                        "http://localhost:5000/user/list"
                    ),

                    // Busca todos os treinos
                    axios.get(
                        "http://localhost:5000/treino/list"
                    )

                ]);

                // Obtém os dados do agendamento
                const agenda = responseAgenda.data;

                // Atualiza as listas utilizadas nos selects
                setAlunos(responseAlunos.data);
                setTreinos(responseTreinos.data);

                // Converte os IDs em strings para os selects
                setUsuarioId(
                    String(agenda.usuario_id || "")
                );

                setTreinoId(
                    String(agenda.treino_id || "")
                );

                // Se existir uma data, remove a parte do horário
                // Exemplo: 2026-10-22T14:30:00 -> 2026-10-22
                if (agenda.data) {

                    setData(
                        agenda.data.split("T")[0]
                    );

                }

                // Preenche o status ou utiliza "pendente"
                setStatus(
                    agenda.status || "pendente"
                );

            } catch (error) {

                // Mostra o erro no console
                console.error(error);

                // Verifica se o servidor retornou um erro
                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar agendamento!"
                    );

                } else {

                    // Erro de conexão com o servidor
                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }

                // Retorna para a agenda se ocorrer um erro
                navigate("/agenda");

            } finally {

                // Finaliza o estado de carregamento
                setCarregando(false);

            }

        }

        // Chama a função de carregamento
        carregarDados();

    }, [id, navigate]);

    // =========================================
    // SALVAR ALTERAÇÕES
    // =========================================

    // Executada quando o formulário é enviado
    async function handleEditarAgenda(e) {

        // Impede o recarregamento padrão da página
        e.preventDefault();

        // Valida se um aluno foi selecionado
        if (!usuarioId) {

            alert("Selecione um aluno!");

            // Interrompe a função
            return;

        }

        // Valida se um treino foi selecionado
        if (!treinoId) {

            alert("Selecione um treino!");

            return;

        }

        // Valida se a data foi informada
        if (!data) {

            alert("Informe a data do treino!");

            return;

        }

        // Valida se o status foi informado
        if (!status) {

            alert("Informe o status!");

            return;

        }

        try {

            // Indica que o salvamento começou
            setSalvando(true);

            // Envia os dados alterados ao backend
            const response = await axios.post(
                "http://localhost:5000/agenda/update",
                {
                    id,
                    usuario_id: usuarioId,
                    treino_id: treinoId,
                    data,
                    status
                }
            );

            // Exibe a mensagem retornada pelo backend
            alert(response.data.message);

            // Retorna para a página de agendamentos
            navigate("/agenda");

        } catch (error) {

            // Registra o erro no console
            console.error(error);

            // Trata erros retornados pelo backend
            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao atualizar agendamento!"
                );

            } else {

                // Trata erros de conexão
                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        } finally {

            // Finaliza o estado de salvamento
            setSalvando(false);

        }

    }

    // =========================================
    // TELA DE CARREGAMENTO
    // =========================================

    // Exibe uma mensagem enquanto busca os dados
    if (carregando) {

        return (

            <Layout>

                <div className="bg-white rounded-2xl shadow-md p-8">

                    <p className="text-gray-500 text-center">
                        Carregando agendamento...
                    </p>

                </div>

            </Layout>

        );

    }

    // =========================================
    // FORMULÁRIO DE EDIÇÃO
    // =========================================

    return (

        <Layout>

            {/* BOTÃO PARA VOLTAR À AGENDA */}

            <button
                onClick={() => navigate("/agenda")}
                disabled={salvando}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 disabled:opacity-50 mb-6 transition"
            >

                <ArrowLeft size={20} />

                Voltar para Agenda

            </button>

            <div>

                {/* TÍTULO DA PÁGINA */}

                <h1 className="text-4xl font-bold">
                    Editar Agendamento
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Altere as informações do agendamento.
                </p>

                {/* FORMULÁRIO */}

                {/* onSubmit chama a função que valida
                    e envia as alterações ao backend
                */}
                <form
                    onSubmit={handleEditarAgenda}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    {/* CAMPO ALUNO */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Aluno
                        </label>

                        <div className="relative">

                            {/* Ícone do aluno */}
                            <User
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            {/* Campo controlado pelo estado usuarioId */}
                            <select
                                value={usuarioId}
                                onChange={(e) =>
                                    setUsuarioId(e.target.value)
                                }
                                disabled={salvando}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:bg-gray-100"
                            >

                                <option value="">
                                    Selecione um aluno
                                </option>

                                {/* Percorre a lista e cria uma opção
                                    para cada aluno recebido do backend
                                */}
                                {alunos.map((aluno) => (

                                    <option
                                        key={aluno.id}
                                        value={aluno.id}
                                    >
                                        {aluno.nome}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                    {/* CAMPO TREINO */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Treino
                        </label>

                        <div className="relative">

                            {/* Ícone do treino */}
                            <Dumbbell
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            {/* Campo controlado pelo estado treinoId */}
                            <select
                                value={treinoId}
                                onChange={(e) =>
                                    setTreinoId(e.target.value)
                                }
                                disabled={salvando}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:bg-gray-100"
                            >

                                <option value="">
                                    Selecione um treino
                                </option>

                                {/* Cria as opções usando os treinos
                                    recebidos do backend
                                */}
                                {treinos.map((treino) => (

                                    <option
                                        key={treino.id}
                                        value={treino.id}
                                    >
                                        {treino.nome}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                    {/* CAMPO DATA */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Data do Treino
                        </label>

                        <div className="relative">

                            {/* Ícone de calendário */}
                            <CalendarDays
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            {/* Campo HTML específico para datas */}
                            <input
                                type="date"
                                value={data}
                                onChange={(e) =>
                                    setData(e.target.value)
                                }
                                disabled={salvando}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:bg-gray-100"
                            />

                        </div>

                    </div>

                    {/* CAMPO STATUS */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Status
                        </label>

                        {/* Permite selecionar o status do agendamento */}
                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            disabled={salvando}
                            className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:bg-gray-100"
                        >

                            <option value="pendente">
                                Pendente
                            </option>

                            <option value="concluido">
                                Concluído
                            </option>

                        </select>

                    </div>

                    {/* BOTÕES DO FORMULÁRIO */}

                    <div className="flex justify-end gap-4 pt-8 border-t">

                        {/* Cancela a edição e retorna à agenda */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/agenda")
                            }
                            disabled={salvando}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Cancelar
                        </button>

                        {/* Envia o formulário para salvar alterações */}
                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                            {/* Altera o texto conforme o estado salvando */}
                            {salvando
                                ? "Salvando..."
                                : "Salvar Alterações"}

                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );

}
