
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Componentes utilizados na página
import Layout from "../../components/Layout/Layout";
import AlunoCard from "../../components/AlunoCard/AlunoCard";

// Ícones da biblioteca lucide-react
import {
    UserPlus,
    Search
} from "lucide-react";

// Componente responsável pela listagem e gerenciamento dos alunos
export default function Alunos() {

    // Permite navegar entre as páginas do aplicativo
    const navigate = useNavigate();

    // Armazena os alunos recebidos do backend
    const [alunos, setAlunos] = useState([]);

    // Armazena o texto digitado no campo de pesquisa
    const [pesquisa, setPesquisa] = useState("");

    // Controla a exibição da mensagem de carregamento
    const [carregando, setCarregando] = useState(true);

    // Executa a busca de alunos quando o componente é montado
    useEffect(() => {
        buscarAlunos();
    }, []);

    // Função assíncrona que consulta os alunos cadastrados
    async function buscarAlunos() {
        try {
            // Informa que o carregamento começou
            setCarregando(true);

            // Faz uma requisição GET ao backend
            const response = await axios.get(
                "http://localhost:5000/user/list"
            );

            // Atualiza o estado com os alunos retornados
            setAlunos(response.data);

        } catch (error) {
            // Trata possíveis erros durante a consulta
            console.error(error);
            alert("Erro ao buscar alunos!");

        } finally {
            // Finaliza o carregamento, mesmo se ocorrer erro
            setCarregando(false);
        }
    }

    // Função responsável por excluir um aluno pelo ID
    async function excluirAluno(idUsuario) {

        // Solicita confirmação antes de excluir
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este aluno?"
        );

        // Cancela a exclusão se o usuário não confirmar
        if (!confirmar) {
            return;
        }

        try {
            // Envia uma requisição DELETE ao backend
            const response = await axios.delete(
                "http://localhost:5000/user/delete",
                {
                    // Envia o ID do aluno no corpo da requisição
                    data: {
                        idUsuario
                    }
                }
            );

            // Mostra a mensagem retornada pelo backend
            alert(response.data.message);

            // Atualiza a lista após a exclusão
            buscarAlunos();

        } catch (error) {
            console.error(error);

            // Verifica se o servidor retornou uma resposta de erro
            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Erro ao excluir aluno!"
                );
            } else {
                // Mensagem exibida quando não há resposta do servidor
                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }
    }

    // Filtra os alunos pelo nome digitado na pesquisa
    const alunosFiltrados = alunos.filter((aluno) =>
        aluno.nome
            // Converte o nome para letras minúsculas
            .toLowerCase()
            // Verifica se o nome contém o texto pesquisado
            .includes(pesquisa.toLowerCase())
    );

    // Interface visual da página
    return (
        <Layout>
            <div>
                {/* Cabeçalho da página */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Alunos
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Gerencie todos os alunos cadastrados.
                        </p>
                    </div>

                    {/* Botão para acessar o cadastro de alunos */}
                    <button
                        onClick={() => navigate("/cadastrar-aluno")}
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >
                        <UserPlus size={20} />
                        Novo Aluno
                    </button>
                </div>

                {/* Campo utilizado para pesquisar alunos */}
                <div className="relative mb-8">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        // Valor controlado pelo estado pesquisa
                        value={pesquisa}
                        // Atualiza a pesquisa conforme o usuário digita
                        onChange={(e) => setPesquisa(e.target.value)}
                        placeholder="Pesquisar aluno..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>

                {/* Renderização condicional da listagem */}
                {carregando ? (
                    // Exibe uma mensagem enquanto busca os dados
                    <p className="text-gray-500">
                        Carregando alunos...
                    </p>
                ) : alunosFiltrados.length === 0 ? (
                    // Exibe uma mensagem quando a lista está vazia
                    <p className="text-gray-500">
                        Nenhum aluno encontrado.
                    </p>
                ) : (
                    // Exibe os alunos encontrados
                    <div className="space-y-5">
                        {alunosFiltrados.map((aluno) => (
                            <AlunoCard
                                // Identificação única do card no React
                                key={aluno.id}
                                // Informações enviadas ao componente
                                nome={aluno.nome}
                                email={aluno.email}
                                telefone={
                                    aluno.telefone ||
                                    "Não informado"
                                }
                                status={
                                    aluno.status ||
                                    "Ativo"
                                }
                                // Navega para a edição do aluno
                                onEditar={() =>
                                    navigate(
                                        `/editar-aluno/${aluno.id}`
                                    )
                                }
                                // Executa a exclusão do aluno
                                onExcluir={() =>
                                    excluirAluno(aluno.id)
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
