
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout";

import {
    Dumbbell,
    FileText,
    ArrowLeft,
    Trash2,
    Plus
} from "lucide-react";

// Componente responsável pelo cadastro de treinos.
export default function CadastrarTreino() {

    // Permite navegar entre as páginas do aplicativo.
    const navigate = useNavigate();

    // Estados que armazenam o nome e a descrição do treino.
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    // Armazena os exercícios cadastrados no banco de dados.
    const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);

    // Armazena os exercícios escolhidos para o novo treino.
    // Inicialmente, existe um campo de exercício vazio.
    const [exerciciosSelecionados, setExerciciosSelecionados] = useState([
        {
            exercicio_id: "",
            series: "",
            repeticoes: ""
        }
    ]);

    // Controla se o treino está sendo salvo.
    const [carregando, setCarregando] = useState(false);

    // Controla o carregamento da lista de exercícios.
    const [carregandoExercicios, setCarregandoExercicios] = useState(true);

    // Executa a busca dos exercícios quando a página é aberta.
    // O array vazio indica que o efeito não depende de outros estados.
    useEffect(() => {
        buscarExercicios();
    }, []);

    // Função assíncrona que busca os exercícios no backend.
    async function buscarExercicios() {

        try {

            // Faz uma requisição GET para consultar os exercícios.
            const response = await axios.get(
                "http://localhost:5000/exercicio/list"
            );

            // Armazena os exercícios retornados pela API.
            setExerciciosDisponiveis(response.data);

        } catch (error) {

            // Mostra o erro no console.
            console.error(error);

            // Informa ao usuário que houve um problema.
            alert("Erro ao buscar exercícios!");

        } finally {

            // Finaliza o carregamento, mesmo quando ocorre erro.
            setCarregandoExercicios(false);
        }
    }

    // Adiciona um novo campo de exercício ao formulário.
    function adicionarExercicio() {

        setExerciciosSelecionados([

            // Copia os exercícios que já foram selecionados.
            ...exerciciosSelecionados,

            // Adiciona um novo exercício vazio.
            {
                exercicio_id: "",
                series: "",
                repeticoes: ""
            }
        ]);
    }

    // Remove um exercício da lista pelo índice.
    function removerExercicio(index) {

        // Impede que o último campo de exercício seja removido.
        if (exerciciosSelecionados.length === 1) {
            return;
        }

        // Cria uma nova lista sem o exercício removido.
        const novaLista = exerciciosSelecionados.filter(
            (_, i) => i !== index
        );

        // Atualiza o estado com a nova lista.
        setExerciciosSelecionados(novaLista);
    }

    // Atualiza um campo específico de um exercício.
    function alterarExercicio(index, campo, valor) {

        // Cria uma cópia da lista de exercícios.
        const novaLista = [...exerciciosSelecionados];

        // Atualiza somente o campo informado.
        novaLista[index] = {
            ...novaLista[index],
            [campo]: valor
        };

        // Atualiza o estado e a interface do React.
        setExerciciosSelecionados(novaLista);
    }

    // Função responsável por validar e cadastrar o treino.
    async function handleSalvarTreino(e) {

        // Impede o comportamento padrão do formulário.
        // Assim, a página não recarrega automaticamente.
        e.preventDefault();

        // Verifica se o nome do treino foi preenchido.
        // trim() remove espaços no início e no final.
        if (!nome.trim()) {

            alert("Digite o nome do treino!");
            return;
        }

        // Verifica se existe algum exercício com dados inválidos.
        // some() retorna true se encontrar pelo menos um inválido.
        const exerciciosInvalidos = exerciciosSelecionados.some(
            (exercicio) =>
                !exercicio.exercicio_id ||
                !exercicio.series ||
                !exercicio.repeticoes ||
                Number(exercicio.series) <= 0 ||
                Number(exercicio.repeticoes) <= 0
        );

        // Impede o cadastro com exercícios incompletos.
        if (exerciciosInvalidos) {

            alert(
                "Selecione o exercício e informe séries e repetições maiores que zero."
            );

            return;
        }

        // Percorre os exercícios e cria um array com seus IDs.
        const idsExercicios = exerciciosSelecionados.map(
            (exercicio) => Number(exercicio.exercicio_id)
        );

        // Set mantém apenas valores únicos.
        // Se a quantidade de IDs únicos for diferente da original,
        // significa que existem exercícios duplicados.
        const possuiExercicioDuplicado =
            new Set(idsExercicios).size !== idsExercicios.length;

        // Impede que o mesmo exercício seja cadastrado duas vezes.
        if (possuiExercicioDuplicado) {

            alert(
                "Não é possível adicionar o mesmo exercício mais de uma vez no treino."
            );

            return;
        }

        try {

            // Indica que o processo de salvamento começou.
            setCarregando(true);

            // Envia os dados do treino ao backend usando POST.
            const responseTreino = await axios.post(
                "http://localhost:5000/treino/create",
                {
                    nome: nome.trim(),
                    descricao: descricao.trim()
                }
            );

            // Obtém o ID do treino criado no banco de dados.
            const treinoId = responseTreino.data.treinoId;

            // Verifica se o backend retornou o ID do treino.
            if (!treinoId) {

                alert(
                    "O treino foi criado, mas o backend não retornou o ID do treino."
                );

                return;
            }

            // Percorre todos os exercícios selecionados.
            for (const exercicio of exerciciosSelecionados) {

                // Cadastra a relação entre o treino e o exercício.
                // Envia também as séries e repetições.
                await axios.post(
                    "http://localhost:5000/treino-exercicio/add",
                    {
                        treino_id: treinoId,
                        exercicio_id: Number(exercicio.exercicio_id),
                        series: Number(exercicio.series),
                        repeticoes: Number(exercicio.repeticoes)
                    }
                );
            }

            // Exibe uma mensagem confirmando o cadastro.
            alert(
                "Treino e exercícios cadastrados com sucesso!"
            );

            // Redireciona o usuário para a página de treinos.
            navigate("/treinos");

        } catch (error) {

            // Mostra o erro no console do navegador.
            console.error(error);

            // Verifica se o servidor retornou uma resposta de erro.
            if (error.response) {

                // Exibe a mensagem enviada pelo backend,
                // ou uma mensagem padrão.
                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar treino!"
                );

            } else {

                // Informa quando não foi possível conectar ao servidor.
                alert(
                    "Não foi possível conectar ao servidor."
                );
            }

        } finally {

            // Finaliza o estado de salvamento.
            // Executa mesmo quando ocorre um erro.
            setCarregando(false);
        }
    }

    // Renderiza a interface da página de cadastro de treinos.
    return (

        <Layout>

            {/* Botão para voltar à página de treinos. */}
            <button
                onClick={() => navigate("/treinos")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />
                <span>Voltar para Treinos</span>
            </button>

            <div>

                {/* Título e descrição da página. */}
                <h1 className="text-4xl font-bold">
                    Cadastrar Treino
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Cadastre um novo treino para seus alunos.
                </p>

                {/* Formulário de cadastro de treino. */}
                {/* onSubmit chama a função handleSalvarTreino. */}
                <form
                    onSubmit={handleSalvarTreino}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    {/* Campo para informar o nome do treino. */}
                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome do Treino
                        </label>

                        <div className="relative">

                            <Dumbbell
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            {/* Campo controlado pelo estado nome. */}
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) =>
                                    setNome(e.target.value)
                                }
                                placeholder="Ex.: Treino A"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>
                    </div>

                    {/* Campo para informar a descrição do treino. */}
                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>

                        <div className="relative">

                            <FileText
                                size={18}
                                className="absolute left-4 top-6 text-gray-400"
                            />

                            {/* Atualiza a descrição conforme o usuário digita. */}
                            <textarea
                                rows="4"
                                value={descricao}
                                onChange={(e) =>
                                    setDescricao(e.target.value)
                                }
                                placeholder="Descreva o treino..."
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>
                    </div>

                    {/* Seção para selecionar os exercícios do treino. */}
                    <div className="border-t pt-8">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold">
                                Exercícios
                            </h2>

                            {/* Adiciona mais um campo de exercício. */}
                            <button
                                type="button"
                                onClick={adicionarExercicio}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
                            >
                                <Plus size={18} />
                                Adicionar Exercício
                            </button>

                        </div>

                        {/* Exibe uma mensagem enquanto os exercícios carregam. */}
                        {carregandoExercicios ? (

                            <p className="text-gray-500">
                                Carregando exercícios...
                            </p>

                        ) : exerciciosDisponiveis.length === 0 ? (

                            // Mostra uma mensagem quando não há exercícios.
                            <p className="text-red-500">
                                Nenhum exercício cadastrado.
                            </p>

                        ) : (

                            // Mostra os exercícios selecionados no formulário.
                            <div className="space-y-4">

                                {/* map() cria os campos de cada exercício. */}
                                {exerciciosSelecionados.map(
                                    (exercicio, index) => (

                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-xl p-5"
                                        >

                                            <div className="flex justify-between items-center mb-4">

                                                {/* Exibe a posição do exercício. */}
                                                <h3 className="font-semibold text-gray-700">
                                                    Exercício {index + 1}
                                                </h3>

                                                {/* Mostra o botão de remover se houver mais de um exercício. */}
                                                {exerciciosSelecionados.length > 1 && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removerExercicio(index)
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>

                                                )}

                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                {/* Seleção do exercício. */}
                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Exercício
                                                    </label>

                                                    <select
                                                        value={exercicio.exercicio_id}
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "exercicio_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                    >

                                                        <option value="">
                                                            Selecione
                                                        </option>

                                                        {/* Cria as opções com os exercícios retornados pela API. */}
                                                        {exerciciosDisponiveis.map(
                                                            (item) => (

                                                                <option
                                                                    key={item.id}
                                                                    value={item.id}
                                                                >
                                                                    {item.nome} - {item.grupo_muscular}
                                                                </option>

                                                            )
                                                        )}

                                                    </select>

                                                </div>

                                                {/* Campo para informar as séries. */}
                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Séries
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={exercicio.series}
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "series",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Ex.: 4"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                    />

                                                </div>

                                                {/* Campo para informar as repetições. */}
                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Repetições
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={exercicio.repeticoes}
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "repeticoes",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Ex.: 12"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                    {/* Botões para cancelar ou salvar o cadastro. */}
                    <div className="flex justify-end gap-4 pt-8 border-t">

                        {/* Volta para a listagem sem enviar o formulário. */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/treinos")
                            }
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Cancelar
                        </button>

                        {/* Botão que envia o formulário. */}
                        {/* disabled impede o envio durante o carregamento. */}
                        <button
                            type="submit"
                            disabled={
                                carregando ||
                                carregandoExercicios ||
                                exerciciosDisponiveis.length === 0
                            }
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                            {/* Altera o texto conforme o estado de salvamento. */}
                            {carregando
                                ? "Salvando..."
                                : "Salvar Treino"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </Layout>
    );
}
