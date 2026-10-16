
import Layout from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Ícones utilizados nos botões e no campo de pesquisa
import {
    Search,
    Plus,
    Trash2,
    Pencil
} from "lucide-react";

// Componente responsável pela listagem das avaliações físicas
export default function Avaliacoes() {

    // Permite navegar entre as páginas do aplicativo
    const navigate = useNavigate();

    // Armazena a lista de avaliações recebida do backend
    const [avaliacoes, setAvaliacoes] = useState([]);

    // Armazena o texto digitado na pesquisa
    const [pesquisa, setPesquisa] = useState("");

    // Controla a mensagem de carregamento
    const [carregando, setCarregando] = useState(true);

    // Busca as avaliações quando o componente é montado
    useEffect(() => {
        carregarAvaliacoes();
    }, []);

    // Função assíncrona para consultar as avaliações no backend
    async function carregarAvaliacoes() {

        try {
            // Realiza uma requisição HTTP GET
            const response = await axios.get(
                "http://localhost:5000/avaliacao/list"
            );

            // Verifica se o backend retornou um array
            // Se não retornou, utiliza uma lista vazia
            setAvaliacoes(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            // Registra o erro no console
            console.error(error);

            // Verifica se houve uma resposta de erro do servidor
            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Erro ao carregar avaliações!"
                );
            } else {
                // Trata problemas de conexão
                alert(
                    "Não foi possível conectar ao servidor."
                );
            }

        } finally {

            // Encerra o carregamento, mesmo se ocorrer erro
            setCarregando(false);
        }
    }

    // Função responsável pela exclusão de uma avaliação
    async function excluirAvaliacao(id) {

        // Solicita confirmação antes da exclusão
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir esta avaliação?"
        );

        // Interrompe a função se o usuário cancelar
        if (!confirmar) {
            return;
        }

        try {

            // Envia uma requisição DELETE com o ID da avaliação
            const response = await axios.delete(
                "http://localhost:5000/avaliacao/delete",
                {
                    data: {
                        id
                    }
                }
            );

            // Exibe a mensagem retornada pelo backend
            alert(
                response.data.message
            );

            // Atualiza o estado removendo a avaliação excluída
            // O filter mantém apenas os IDs diferentes do excluído
            setAvaliacoes(
                (avaliacoesAtuais) =>
                    avaliacoesAtuais.filter(
                        (avaliacao) =>
                            avaliacao.id !== id
                    )
            );

        } catch (error) {

            console.error(error);

            // Mostra o erro retornado pelo backend, se existir
            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Erro ao excluir avaliação!"
                );
            } else {
                // Mostra uma mensagem quando não há conexão
                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }
    }

    // Converte a data recebida para o formato brasileiro
    function formatarData(data) {

        // Trata o caso de uma data não informada
        if (!data) {
            return "Data não informada";
        }

        // Remove a parte do horário, caso exista
        const dataSomente =
            data.split("T")[0];

        // Separa a data em ano, mês e dia
        const partes =
            dataSomente.split("-");

        // Retorna a data original se o formato for inesperado
        if (partes.length !== 3) {
            return data;
        }

        // Retorna a data no formato dia/mês/ano
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    // Remove espaços das extremidades e converte para minúsculas
    const textoPesquisa =
        pesquisa.trim().toLowerCase();

    // Filtra as avaliações pelo nome do aluno
    const avaliacoesFiltradas =
        avaliacoes.filter(
            (avaliacao) => {

                // Acessa o nome do aluno com segurança
                // Se não existir, utiliza uma string vazia
                const nomeAluno =
                    avaliacao.usuario?.nome
                        ?.toLowerCase() || "";

                // Verifica se o nome contém o texto pesquisado
                return nomeAluno.includes(
                    textoPesquisa
                );
            }
        );

    // Interface visual da página
    return (

        <Layout>

            <div>

                {/* CABEÇALHO */}
                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-4xl font-bold">
                            Avaliações
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Gerencie as avaliações físicas dos alunos.
                        </p>

                    </div>

                    {/* Botão que abre a página de cadastro */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/cadastrar-avaliacao"
                            )
                        }
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-purple-700 px-6 py-3 text-white transition hover:bg-purple-800"
                    >

                        <Plus size={20} />

                        Nova Avaliação

                    </button>

                </div>

                {/* PESQUISA */}
                <div className="relative mb-8">

                    {/* Ícone de pesquisa */}
                    <Search
                        size={18}
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                    />

                    {/* Campo controlado pelo estado pesquisa */}
                    <input
                        type="text"
                        value={pesquisa}
                        onChange={(e) =>
                            setPesquisa(
                                e.target.value
                            )
                        }
                        placeholder="Pesquisar aluno..."
                        className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />

                </div>

                {/* CARREGANDO */}
                {/* Exibe uma mensagem enquanto os dados são buscados */}
                {carregando && (

                    <p className="text-gray-500">
                        Carregando avaliações...
                    </p>

                )}

                {/* NENHUMA AVALIAÇÃO */}
                {/* Exibe esta mensagem se o carregamento terminou
                    e não existem avaliações no resultado */}
                {!carregando &&
                    avaliacoesFiltradas.length === 0 && (

                        <div className="rounded-2xl bg-white p-8 text-center shadow-md">

                            <p className="text-gray-500">
                                Nenhuma avaliação encontrada.
                            </p>

                        </div>

                    )}

                {/* LISTAGEM */}
                {/* Exibe a lista quando o carregamento termina */}
                {!carregando && (

                    <div className="space-y-5">

                        {/* Percorre o array e cria um card para cada avaliação */}
                        {avaliacoesFiltradas.map(
                            (avaliacao) => (

                                <div
                                    key={avaliacao.id}
                                    className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-md md:flex-row md:items-center md:justify-between"
                                >

                                    {/* DADOS DA AVALIAÇÃO */}
                                    <div>

                                        {/* Nome do aluno associado à avaliação */}
                                        <h2 className="text-xl font-bold">

                                            {avaliacao.usuario?.nome ||
                                                "Aluno não encontrado"}

                                        </h2>

                                        {/* Peso registrado na avaliação */}
                                        <p className="mt-2 text-gray-500">

                                            Peso:{" "}
                                            {avaliacao.peso} kg

                                        </p>

                                        {/* Altura registrada na avaliação */}
                                        <p className="text-gray-500">

                                            Altura:{" "}
                                            {avaliacao.altura} m

                                        </p>

                                        {/* IMC registrado na avaliação */}
                                        <p className="text-gray-500">

                                            IMC:{" "}
                                            {avaliacao.imc}

                                        </p>

                                        {/* Mostra as observações somente se existirem */}
                                        {avaliacao.observacoes && (

                                            <p className="mt-2 text-gray-500">

                                                Observações:{" "}
                                                {avaliacao.observacoes}

                                            </p>

                                        )}

                                    </div>

                                    {/* DATA E BOTÕES */}
                                    <div className="flex flex-col gap-4 md:items-end">

                                        {/* Data formatada para o padrão brasileiro */}
                                        <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">

                                            {formatarData(
                                                avaliacao.data_avaliacao
                                            )}

                                        </span>

                                        <div className="flex gap-4">

                                            {/* Botão para editar a avaliação selecionada */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/editar-avaliacao/${avaliacao.id}`
                                                    )
                                                }
                                                className="flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900"
                                            >

                                                <Pencil size={18} />

                                                Editar

                                            </button>

                                            {/* Botão para excluir a avaliação selecionada */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    excluirAvaliacao(
                                                        avaliacao.id
                                                    )
                                                }
                                                className="flex cursor-pointer items-center gap-2 text-red-600 transition hover:text-red-800"
                                            >

                                                <Trash2 size={18} />

                                                Excluir

                                            </button>

                                        </div>

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
