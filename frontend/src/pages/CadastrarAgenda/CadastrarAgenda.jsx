// Componente responsável pelo layout padrão do sistema
import Layout from "../../components/Layout/Layout";

// Hooks do React
import { useEffect, useState } from "react";

// Hook utilizado para navegar entre páginas
import { useNavigate } from "react-router-dom";

// Biblioteca para realizar requisições HTTP ao backend
import axios from "axios";

// Ícones utilizados na interface
import {
    ArrowLeft,
    User,
    Dumbbell,
    CalendarDays
} from "lucide-react";

// Componente responsável pelo cadastro de agendamentos
export default function CadastrarAgenda() {

    // Permite redirecionar o usuário para outras páginas
    const navigate = useNavigate();

    // Armazena as listas de alunos e treinos recebidas do backend
    // Os arrays começam vazios até os dados serem carregados
    const [alunos, setAlunos] = useState([]);
    const [treinos, setTreinos] = useState([]);

    // Armazena os valores selecionados no formulário
    const [usuarioId, setUsuarioId] = useState("");
    const [treinoId, setTreinoId] = useState("");
    const [data, setData] = useState("");

    // Controla o carregamento inicial dos alunos e treinos
    const [carregando, setCarregando] = useState(true);

    // Controla o processo de salvar um novo agendamento
    const [salvando, setSalvando] = useState(false);

    // Executa a busca de dados quando o componente é montado
    // O array vazio indica que o efeito não depende de estados
    useEffect(() => {

        // Função assíncrona responsável por buscar alunos e treinos
        async function carregarDados() {

            try {

                // Promise.all executa as duas requisições simultaneamente
                // O await aguarda ambas terminarem
                const [responseAlunos, responseTreinos] =
                    await Promise.all([

                        // Busca os usuários cadastrados no backend
                        axios.get(
                            "http://localhost:5000/user/list"
                        ),

                        // Busca os treinos cadastrados no backend
                        axios.get(
                            "http://localhost:5000/treino/list"
                        )

                    ]);

                // Atualiza os estados com os dados recebidos
                setAlunos(responseAlunos.data);
                setTreinos(responseTreinos.data);

            } catch (error) {

                // Captura possíveis erros durante as requisições
                console.error(error);

                // Informa ao usuário que houve um problema
                alert(
                    "Erro ao carregar alunos e treinos!"
                );

            } finally {

                // Finaliza o estado de carregamento
                // Executa independentemente de sucesso ou erro
                setCarregando(false);
            }
        }

        // Chama a função que busca os dados
        carregarDados();

    }, []);

    // Função executada quando o formulário é enviado
    async function handleSalvarAgenda(e) {

        // Impede que o formulário recarregue a página
        e.preventDefault();

        // Verifica se um aluno foi selecionado
        if (!usuarioId) {
            alert("Selecione um aluno!");
            return;
        }

        // Verifica se um treino foi selecionado
        if (!treinoId) {
            alert("Selecione um treino!");
            return;
        }

        // Verifica se uma data foi informada
        if (!data) {
            alert("Selecione a data do treino!");
            return;
        }

        try {

            // Indica que o processo de salvamento começou
            setSalvando(true);

            // Envia os dados do agendamento para o backend
            const response = await axios.post(
                "http://localhost:5000/agenda/create",
                {
                    // ID do aluno selecionado
                    usuario_id: usuarioId,

                    // ID do treino selecionado
                    treino_id: treinoId,

                    // Data escolhida para o treino
                    data,

                    // Todo novo agendamento começa como pendente
                    status: "pendente"
                }
            );

            // Exibe a mensagem retornada pelo backend
            alert(response.data.message);

            // Redireciona para a página de agenda
            navigate("/agenda");

        } catch (error) {

            // Registra o erro no console para auxiliar na depuração
            console.error(error);

            // Verifica se o servidor retornou uma resposta de erro
            if (error.response) {

                // Exibe a mensagem do backend, quando disponível
                alert(
                    error.response.data.message ||
                    "Erro ao criar agendamento!"
                );

            } else {

                // Mensagem utilizada quando não há resposta do servidor
                alert(
                    "Não foi possível conectar ao servidor."
                );
            }

        } finally {

            // Finaliza o estado de salvamento
            setSalvando(false);
        }
    }

    // Estrutura visual da página
    return (

        <Layout>

            {/* Botão para voltar à página de agenda */}
            <button
                onClick={() => navigate("/agenda")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />
                Voltar para Agenda
            </button>

            <div>

                {/* Título da página */}
                <h1 className="text-4xl font-bold">
                    Novo Agendamento
                </h1>

                {/* Descrição da funcionalidade */}
                <p className="text-gray-500 mt-2 mb-8">
                    Agende um treino para um aluno.
                </p>

                {/* Formulário de cadastro de agendamento */}
                {/* onSubmit chama a função responsável por salvar */}
                <form
                    onSubmit={handleSalvarAgenda}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    {/* CAMPO DE SELEÇÃO DO ALUNO */}
                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Aluno
                        </label>

                        <div className="relative">

                            {/* Ícone do campo de aluno */}
                            <User
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            {/* Lista de alunos recebida do backend */}
                            <select
                                value={usuarioId}
                                onChange={(e) =>
                                    setUsuarioId(e.target.value)
                                }
                                disabled={carregando}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >

                                {/* Mensagem exibida antes da seleção */}
                                <option value="">
                                    {carregando
                                        ? "Carregando alunos..."
                                        : "Selecione um aluno"}
                                </option>

                                {/* Percorre o array e cria uma opção por aluno */}
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

                    {/* CAMPO DE SELEÇÃO DO TREINO */}
                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Treino
                        </label>

                        <div className="relative">

                            {/* Ícone do campo de treino */}
                            <Dumbbell
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            {/* Lista de treinos recebida do backend */}
                            <select
                                value={treinoId}
                                onChange={(e) =>
                                    setTreinoId(e.target.value)
                                }
                                disabled={carregando}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >

                                {/* Mensagem exibida durante ou após a busca */}
                                <option value="">
                                    {carregando
                                        ? "Carregando treinos..."
                                        : "Selecione um treino"}
                                </option>

                                {/* Percorre o array e cria uma opção por treino */}
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

                    {/* CAMPO DE SELEÇÃO DA DATA */}
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

                            {/* Campo que permite selecionar uma data */}
                            {/* onChange atualiza o estado com a data escolhida */}
                            <input
                                type="date"
                                value={data}
                                onChange={(e) =>
                                    setData(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* BOTÕES DO FORMULÁRIO */}
                    <div className="flex justify-end gap-4 pt-8 border-t">

                        {/* Botão que cancela o cadastro */}
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

                        {/* Botão que envia o formulário */}
                        {/* Fica desabilitado durante o carregamento ou salvamento */}
                        <button
                            type="submit"
                            disabled={salvando || carregando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >
                            {/* Exibe um texto diferente enquanto salva */}
                            {salvando
                                ? "Salvando..."
                                : "Salvar Agendamento"}
                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );
}