
import { useEffect, useState } from "react";

// Hook utilizado para navegar entre as páginas.
import { useNavigate } from "react-router-dom";

// Biblioteca utilizada para fazer requisições HTTP.
import axios from "axios";

// Componentes reutilizáveis do EvolutionFit.
import Layout from "../../components/Layout/Layout";
import ExercicioCard from "../../components/ExercicioCard/ExercicioCard";

// Ícones utilizados na interface.
import {
    Plus,
    Search
} from "lucide-react";

// Componente responsável pela listagem e gerenciamento dos exercícios.
export default function Exercicios() {

    // Permite navegar para outras páginas do aplicativo.
    const navigate = useNavigate();

    // Armazena todos os exercícios recebidos do backend.
    const [exercicios, setExercicios] = useState([]);

    // Armazena o texto digitado no campo de pesquisa.
    const [pesquisa, setPesquisa] = useState("");

    // Controla a mensagem de carregamento.
    const [carregando, setCarregando] = useState(true);

    // =========================================
    // CARREGAMENTO INICIAL
    // =========================================

    // Executa a busca quando o componente é montado.
    // O array vazio indica que o efeito não depende
    // de alterações de outros estados.
    useEffect(() => {
        buscarExercicios();
    }, []);

    // =========================================
    // BUSCAR EXERCÍCIOS NO BACKEND
    // =========================================

    // async declara uma função assíncrona.
    async function buscarExercicios() {

        try {

            // Informa que o carregamento começou.
            setCarregando(true);

            // GET busca os exercícios cadastrados no backend.
            // await aguarda a resposta da requisição.
            const response = await axios.get(
                "http://localhost:5000/exercicio/list"
            );

            // response.data contém os dados retornados.
            // Atualiza o estado com a lista recebida.
            setExercicios(response.data);

        } catch (error) {

            // Registra o erro no console para depuração.
            console.error(error);

            // Verifica se o servidor retornou uma resposta de erro.
            if (error.response) {

                // Exibe a mensagem enviada pelo backend,
                // ou uma mensagem padrão caso ela não exista.
                alert(
                    error.response.data.message ||
                    "Erro ao buscar exercícios!"
                );

            } else {

                // Exibida quando não há resposta HTTP,
                // por exemplo, por uma falha de conexão.
                alert("Não foi possível conectar ao servidor.");
            }

        } finally {

            // Encerra o carregamento mesmo se ocorrer um erro.
            setCarregando(false);
        }
    }

    // =========================================
    // EXCLUIR EXERCÍCIO
    // =========================================

    // Recebe o ID do exercício que será excluído.
    async function handleExcluirExercicio(id) {

        // Abre uma janela de confirmação.
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este exercício?"
        );

        // Se o professor clicar em Cancelar,
        // interrompe a função e não exclui o exercício.
        if (!confirmar) {
            return;
        }

        try {

            // Envia uma requisição DELETE ao backend.
            const response = await axios.delete(
                "http://localhost:5000/exercicio/delete",
                {
                    // Envia o ID no corpo da requisição.
                    data: {
                        idExercicio: id
                    }
                }
            );

            // Mostra a mensagem retornada pelo backend.
            alert(response.data.message);

            // Atualiza a lista após a exclusão bem-sucedida.
            setExercicios((exerciciosAtuais) =>

                // filter cria um novo array.
                // Mantém somente os exercícios cujo ID
                // seja diferente do exercício excluído.
                exerciciosAtuais.filter(
                    (exercicio) => exercicio.id !== id
                )
            );

        } catch (error) {

            // Registra o erro no console.
            console.error(error);

            // Verifica se o backend respondeu com erro.
            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao excluir exercício!"
                );

            } else {

                // Mensagem para falhas sem resposta HTTP.
                alert("Não foi possível conectar ao servidor.");
            }
        }
    }

    // =========================================
    // PREPARAÇÃO DO TEXTO PESQUISADO
    // =========================================

    // trim remove espaços do início e do final.
    // toLowerCase transforma as letras em minúsculas.
    // Isso permite uma pesquisa sem diferenciar maiúsculas
    // de minúsculas.
    const textoPesquisa = pesquisa.trim().toLowerCase();

    // =========================================
    // FILTRAGEM DOS EXERCÍCIOS
    // =========================================

    // filter percorre a lista completa e cria
    // uma nova lista com os exercícios correspondentes.
    const exerciciosFiltrados = exercicios.filter((exercicio) => {

        // Obtém o nome em letras minúsculas.
        // ?. evita erros se o valor for null ou undefined.
        // || "" utiliza uma string vazia como valor padrão.
        const nome =
            exercicio.nome?.toLowerCase() || "";

        // Obtém o grupo muscular em letras minúsculas.
        const grupoMuscular =
            exercicio.grupo_muscular?.toLowerCase() || "";

        // includes verifica se o texto contém a pesquisa.
        // || significa OU: basta uma condição ser verdadeira.
        // A pesquisa funciona pelo nome ou grupo muscular.
        return (
            nome.includes(textoPesquisa) ||
            grupoMuscular.includes(textoPesquisa)
        );
    });

    // =========================================
    // INTERFACE PRINCIPAL
    // =========================================

    return (

        // Layout padrão do aplicativo.
        <Layout>

            {/* =====================================
                CABEÇALHO DA PÁGINA
                ===================================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>

                    {/* Título principal. */}
                    <h1 className="text-4xl font-bold">
                        Exercícios
                    </h1>

                    {/* Descrição da página. */}
                    <p className="text-gray-500 mt-2">
                        Gerencie os exercícios utilizados nos treinos.
                    </p>

                </div>

                {/* BOTÃO NOVO EXERCÍCIO */}

                {/* onClick executa a navegação quando
                    o professor clica no botão. */}
                <button
                    onClick={() => navigate("/cadastrar-exercicio")}
                    className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                >

                    {/* Ícone de adição. */}
                    <Plus size={20} />

                    Novo Exercício

                </button>

            </div>

            {/* =====================================
                CAMPO DE PESQUISA
                ===================================== */}

            <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

                <div className="relative">

                    {/* Ícone de pesquisa. */}
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    {/* Campo controlado pelo estado pesquisa. */}
                    <input

                        // Define o campo como texto.
                        type="text"

                        // Mantém o valor do campo vinculado ao estado.
                        value={pesquisa}

                        // Captura o texto digitado e atualiza o estado.
                        // e.target.value representa o valor do input.
                        onChange={(e) => setPesquisa(e.target.value)}

                        placeholder="Pesquisar por nome ou grupo muscular..."

                        className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

            </div>

            {/* =====================================
                RENDERIZAÇÃO CONDICIONAL
                ===================================== */}

            {/* O operador ternário (? :) determina
                qual conteúdo será exibido na tela. */}

            {carregando ? (

                // PRIMEIRA SITUAÇÃO:
                // Os exercícios ainda estão sendo carregados.

                <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                    <p className="text-gray-500">
                        Carregando exercícios...
                    </p>

                </div>

            ) : exerciciosFiltrados.length === 0 ? (

                // SEGUNDA SITUAÇÃO:
                // Não existem exercícios correspondentes à pesquisa.

                <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                    <p className="text-gray-500">
                        Nenhum exercício encontrado.
                    </p>

                </div>

            ) : (

                // TERCEIRA SITUAÇÃO:
                // Existem exercícios para exibir.

                // Grid responsivo:
                // 1 coluna em telas pequenas.
                // 2 colunas em telas médias.
                // 3 colunas em telas maiores.
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {/* map percorre a lista filtrada
                        e cria um card para cada exercício. */}
                    {exerciciosFiltrados.map((exercicio) => (

                        // Componente reutilizável que exibe
                        // as informações de cada exercício.
                        <ExercicioCard

                            // Identificador único utilizado pelo React.
                            key={exercicio.id}

                            // Props com os dados do exercício.
                            nome={exercicio.nome}
                            grupoMuscular={exercicio.grupo_muscular}
                            descricao={exercicio.descricao}

                            // Função enviada ao card para editar.
                            // Navega para a página de edição
                            // incluindo o ID na URL.
                            onEditar={() =>
                                navigate(
                                    `/editar-exercicio/${exercicio.id}`
                                )
                            }

                            // Função enviada ao card para excluir.
                            // Passa o ID do exercício selecionado.
                            onExcluir={() =>
                                handleExcluirExercicio(exercicio.id)
                            }

                        />

                    ))}

                </div>

            )}

        </Layout>
    );
}
