
import { useEffect, useState } from "react";

// Hooks do React Router para navegar e obter parâmetros da URL.
import { useNavigate, useParams } from "react-router-dom";

// Biblioteca utilizada para fazer requisições HTTP ao backend.
import axios from "axios";

// Layout padrão do aplicativo EvolutionFit.
import Layout from "../../components/Layout/Layout";

// Ícones utilizados na interface.
import {
    ArrowLeft,
    Dumbbell,
    FileText,
    Plus,
    Trash2
} from "lucide-react";

// Componente responsável pela edição de um treino.
export default function EditarTreino() {

    // Permite navegar entre as páginas do aplicativo.
    const navigate = useNavigate();

    // Obtém o ID do treino através da URL.
    const { id } = useParams();

    // =========================================
    // ESTADOS DO FORMULÁRIO
    // =========================================

    // Armazena o nome do treino.
    const [nome, setNome] = useState("");

    // Armazena a descrição do treino.
    const [descricao, setDescricao] = useState("");

    // Armazena todos os exercícios cadastrados no sistema.
    const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);

    // Armazena os exercícios associados ao treino em edição.
    const [exerciciosTreino, setExerciciosTreino] = useState([]);

    // Guarda os IDs das associações de exercícios que serão removidas.
    const [exerciciosRemovidos, setExerciciosRemovidos] = useState([]);

    // Controla a exibição da mensagem de carregamento.
    const [carregando, setCarregando] = useState(true);

    // Controla o processo de salvamento das alterações.
    const [salvando, setSalvando] = useState(false);

    // =========================================
    // CARREGAMENTO INICIAL DOS DADOS
    // =========================================

    // Executa carregarDados quando o componente é montado
    // e novamente se o ID do treino mudar.
    useEffect(() => {
        carregarDados();
    }, [id]);

    // Função assíncrona que busca as informações necessárias
    // para preencher o formulário de edição.
    async function carregarDados() {

        try {

            // Indica que o carregamento está em andamento.
            setCarregando(true);

            // Busca as informações do treino pelo ID.
            const responseTreino = await axios.get(
                `http://localhost:5000/treino/${id}`
            );

            // Preenche os campos com os dados retornados pelo backend.
            // Caso algum valor seja falso, utiliza uma string vazia.
            setNome(responseTreino.data.nome || "");
            setDescricao(responseTreino.data.descricao || "");

            // Busca todos os exercícios cadastrados no sistema.
            const responseExercicios = await axios.get(
                "http://localhost:5000/exercicio/list"
            );

            // Armazena a lista de exercícios disponíveis.
            setExerciciosDisponiveis(responseExercicios.data);

            // Busca os exercícios que já pertencem ao treino.
            // O treino_id é enviado como parâmetro de consulta.
            const responseTreinoExercicios = await axios.get(
                `http://localhost:5000/treino-exercicio/list?treino_id=${id}`
            );

            // O map percorre os exercícios retornados pelo backend
            // e cria um novo array com os campos necessários.
            const exerciciosFormatados =
                responseTreinoExercicios.data.map((item) => ({

                    // ID da associação entre treino e exercício.
                    id: item.id,

                    // ID do exercício cadastrado.
                    exercicio_id: item.exercicio_id,

                    // Quantidade de séries.
                    series: item.series,

                    // Quantidade de repetições.
                    repeticoes: item.repeticoes,

                    // false indica que o exercício já estava no treino.
                    novo: false
                }));

            // Atualiza a lista de exercícios associados ao treino.
            setExerciciosTreino(exerciciosFormatados);

        } catch (error) {

            // Registra o erro no console.
            console.error(error);

            // Informa que ocorreu um erro ao carregar os dados.
            alert("Erro ao carregar os dados do treino!");

            // Retorna para a listagem de treinos.
            navigate("/treinos");

        } finally {

            // Encerra o carregamento, com ou sem erro.
            setCarregando(false);
        }
    }

    // =========================================
    // ADICIONAR EXERCÍCIO AO FORMULÁRIO
    // =========================================

    function adicionarExercicio() {

        // Cria um novo array mantendo os exercícios anteriores.
        setExerciciosTreino([
            ...exerciciosTreino,

            // Adiciona um novo objeto com campos vazios.
            {
                id: null,
                exercicio_id: "",
                series: "",
                repeticoes: "",

                // true indica que a associação ainda será criada.
                novo: true
            }
        ]);
    }

    // =========================================
    // ALTERAR DADOS DE UM EXERCÍCIO
    // =========================================

    // index: posição do exercício no array.
    // campo: propriedade que será modificada.
    // valor: novo valor informado pelo professor.
    function alterarExercicio(index, campo, valor) {

        // Cria uma cópia do array atual.
        const novaLista = [...exerciciosTreino];

        // Atualiza somente o objeto da posição selecionada.
        novaLista[index] = {

            // Mantém os outros dados do exercício.
            ...novaLista[index],

            // Atualiza dinamicamente o campo informado.
            [campo]: valor
        };

        // Atualiza o estado com a nova lista.
        setExerciciosTreino(novaLista);
    }

    // =========================================
    // REMOVER EXERCÍCIO DO TREINO
    // =========================================

    function removerExercicio(index) {

        // Recupera o exercício da posição selecionada.
        const exercicio = exerciciosTreino[index];

        // Solicita confirmação antes de remover.
        const confirmar = window.confirm(
            "Deseja realmente remover este exercício do treino?"
        );

        // Se o professor cancelar, interrompe a função.
        if (!confirmar) {
            return;
        }

        // Se o exercício já estava associado ao treino,
        // guarda o ID da associação para removê-la no backend.
        if (!exercicio.novo && exercicio.id) {

            setExerciciosRemovidos((listaAtual) => [
                ...listaAtual,
                exercicio.id
            ]);
        }

        // filter cria uma nova lista sem o exercício selecionado.
        // i representa a posição de cada item.
        // i !== index mantém apenas as posições diferentes.
        const novaLista = exerciciosTreino.filter(
            (_, i) => i !== index
        );

        // Atualiza a lista exibida na tela.
        setExerciciosTreino(novaLista);
    }

    // =========================================
    // SALVAR ALTERAÇÕES DO TREINO
    // =========================================

    async function handleEditarTreino(e) {

        // Impede o envio padrão do formulário pelo navegador.
        e.preventDefault();

        // =====================================
        // VALIDAÇÃO DO NOME
        // =====================================

        // trim remove espaços do início e do final.
        if (!nome.trim()) {

            alert("Digite o nome do treino!");

            // Interrompe a função se o nome estiver vazio.
            return;
        }

        // =====================================
        // VALIDAÇÃO DA LISTA DE EXERCÍCIOS
        // =====================================

        // Impede salvar um treino sem exercícios.
        if (exerciciosTreino.length === 0) {

            alert("Adicione pelo menos um exercício ao treino!");

            return;
        }

        // =====================================
        // VALIDAÇÃO DOS CAMPOS DOS EXERCÍCIOS
        // =====================================

        // some verifica se pelo menos um exercício
        // apresenta alguma informação inválida.
        const exercicioInvalido = exerciciosTreino.some(
            (exercicio) =>

                // Verifica se o exercício foi selecionado.
                !exercicio.exercicio_id ||

                // Verifica se as séries foram preenchidas.
                !exercicio.series ||

                // Verifica se as repetições foram preenchidas.
                !exercicio.repeticoes ||

                // Impede séries menores ou iguais a zero.
                Number(exercicio.series) <= 0 ||

                // Impede repetições menores ou iguais a zero.
                Number(exercicio.repeticoes) <= 0
        );

        // Se algum exercício for inválido, impede o salvamento.
        if (exercicioInvalido) {

            alert(
                "Selecione todos os exercícios e informe séries e repetições maiores que zero."
            );

            return;
        }

        // =====================================
        // VERIFICAÇÃO DE EXERCÍCIOS DUPLICADOS
        // =====================================

        // map cria um array contendo os IDs dos exercícios.
        const idsExercicios = exerciciosTreino.map(
            (exercicio) => Number(exercicio.exercicio_id)
        );

        // Set cria uma coleção de valores únicos.
        // Se a quantidade de valores únicos for diferente
        // da quantidade original, existem exercícios duplicados.
        const possuiExercicioDuplicado =
            new Set(idsExercicios).size !== idsExercicios.length;

        // Impede que o mesmo exercício seja adicionado duas vezes.
        if (possuiExercicioDuplicado) {

            alert(
                "Não é possível adicionar o mesmo exercício mais de uma vez no treino."
            );

            return;
        }

        // =====================================
        // ENVIO DAS ALTERAÇÕES AO BACKEND
        // =====================================

        try {

            // Indica que o processo de salvamento começou.
            setSalvando(true);

            // Atualiza o nome e a descrição do treino.
            await axios.post(
                "http://localhost:5000/treino/update",
                {
                    // Identifica o treino que será atualizado.
                    idTreino: Number(id),

                    // Envia o nome sem espaços extras.
                    nome: nome.trim(),

                    // Envia a descrição sem espaços extras.
                    descricao: descricao.trim()
                }
            );

            // =====================================
            // REMOVER ASSOCIAÇÕES EXCLUÍDAS
            // =====================================

            // for...of percorre os IDs das associações removidas.
            for (const idExercicioRemovido of exerciciosRemovidos) {

                // Envia uma requisição DELETE para cada associação.
                await axios.delete(
                    "http://localhost:5000/treino-exercicio/delete",
                    {
                        // No Axios, data permite enviar dados
                        // no corpo da requisição DELETE.
                        data: {
                            id: idExercicioRemovido
                        }
                    }
                );
            }

            // =====================================
            // ADICIONAR OU ATUALIZAR EXERCÍCIOS
            // =====================================

            // Percorre os exercícios que permanecem no treino.
            for (const exercicio of exerciciosTreino) {

                // Verifica se a associação foi adicionada agora.
                if (exercicio.novo) {

                    // Cria uma nova associação entre treino e exercício.
                    await axios.post(
                        "http://localhost:5000/treino-exercicio/add",
                        {
                            // ID do treino.
                            treino_id: Number(id),

                            // ID do exercício selecionado.
                            exercicio_id: Number(
                                exercicio.exercicio_id
                            ),

                            // Quantidade de séries convertida para número.
                            series: Number(
                                exercicio.series
                            ),

                            // Quantidade de repetições.
                            repeticoes: Number(
                                exercicio.repeticoes
                            )
                        }
                    );

                } else {

                    // Se a associação já existia,
                    // atualiza suas séries e repetições.
                    await axios.post(
                        "http://localhost:5000/treino-exercicio/update",
                        {
                            // ID da associação existente.
                            id: exercicio.id,

                            // Nova quantidade de séries.
                            series: Number(
                                exercicio.series
                            ),

                            // Nova quantidade de repetições.
                            repeticoes: Number(
                                exercicio.repeticoes
                            )
                        }
                    );
                }
            }

            // Informa que todas as requisições terminaram.
            alert(
                "Treino e exercícios atualizados com sucesso!"
            );

            // Retorna à página de listagem dos treinos.
            navigate("/treinos");

        } catch (error) {

            // Registra o erro no console.
            console.error(error);

            // Verifica se houve uma resposta de erro do backend.
            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao atualizar treino!"
                );

            } else {

                // Mensagem quando não há resposta HTTP do servidor.
                alert(
                    "Não foi possível conectar ao servidor."
                );
            }

        } finally {

            // Encerra o estado de salvamento,
            // independentemente de sucesso ou erro.
            setSalvando(false);
        }
    }

    // =========================================
    // TELA DE CARREGAMENTO
    // =========================================

    // Enquanto os dados estão sendo buscados,
    // exibe uma mensagem no lugar do formulário.
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
    // INTERFACE PRINCIPAL
    // =========================================

    return (

        <Layout>

            {/* BOTÃO PARA VOLTAR À LISTAGEM DE TREINOS */}

            <button
                onClick={() => navigate("/treinos")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />

                <span>Voltar para Treinos</span>
            </button>

            <div>

                {/* TÍTULO E DESCRIÇÃO DA PÁGINA */}

                <h1 className="text-4xl font-bold">
                    Editar Treino
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Atualize os dados e exercícios do treino.
                </p>

                {/* FORMULÁRIO DE EDIÇÃO */}

                {/* onSubmit executa handleEditarTreino
                    quando o formulário é enviado. */}
                <form
                    onSubmit={handleEditarTreino}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    {/* =====================================
                        CAMPO: NOME DO TREINO
                        ===================================== */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome do Treino
                        </label>

                        <div className="relative">

                            {/* Ícone decorativo do campo. */}
                            <Dumbbell
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            {/* Campo controlado pelo estado nome. */}
                            <input
                                type="text"

                                // Exibe o valor armazenado no estado.
                                value={nome}

                                // Atualiza o estado quando o usuário digita.
                                onChange={(e) =>
                                    setNome(e.target.value)
                                }

                                placeholder="Nome do treino"

                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* =====================================
                        CAMPO: DESCRIÇÃO DO TREINO
                        ===================================== */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>

                        <div className="relative">

                            {/* Ícone decorativo da descrição. */}
                            <FileText
                                size={18}
                                className="absolute left-4 top-6 text-gray-400"
                            />

                            {/* textarea permite digitar várias linhas. */}
                            <textarea
                                rows="4"

                                // Exibe a descrição armazenada no estado.
                                value={descricao}

                                // Atualiza a descrição conforme o usuário digita.
                                onChange={(e) =>
                                    setDescricao(e.target.value)
                                }

                                placeholder="Descrição do treino"

                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* =====================================
                        SEÇÃO DE EXERCÍCIOS DO TREINO
                        ===================================== */}

                    <div className="border-t pt-8">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold">
                                Exercícios
                            </h2>

                            {/* BOTÃO PARA ADICIONAR EXERCÍCIO */}

                            {/* type="button" evita enviar o formulário.
                                onClick chama adicionarExercicio. */}
                            <button
                                type="button"
                                onClick={adicionarExercicio}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
                            >
                                <Plus size={18} />

                                Adicionar Exercício
                            </button>

                        </div>

                        {/* Se não existir nenhum exercício,
                            mostra uma mensagem. Caso contrário,
                            renderiza a lista. */}
                        {exerciciosTreino.length === 0 ? (

                            <p className="text-gray-500">
                                Nenhum exercício adicionado ao treino.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {/* map percorre a lista e cria
                                    os campos de cada exercício. */}
                                {exerciciosTreino.map(
                                    (exercicio, index) => (

                                        <div
                                            // key ajuda o React a identificar
                                            // cada elemento renderizado.
                                            key={
                                                exercicio.id ||
                                                `novo-${index}`
                                            }

                                            className="border border-gray-200 rounded-xl p-5"
                                        >

                                            {/* CABEÇALHO DO EXERCÍCIO */}

                                            <div className="flex justify-between items-center mb-4">

                                                {/* index + 1 mostra a numeração
                                                    começando em 1. */}
                                                <h3 className="font-semibold text-gray-700">
                                                    Exercício {index + 1}
                                                </h3>

                                                {/* BOTÃO REMOVER EXERCÍCIO */}

                                                <button
                                                    type="button"

                                                    // Envia a posição do exercício
                                                    // para a função de remoção.
                                                    onClick={() =>
                                                        removerExercicio(index)
                                                    }

                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <Trash2 size={20} />
                                                </button>

                                            </div>

                                            {/* GRID COM TRÊS CAMPOS:
                                                EXERCÍCIO, SÉRIES E REPETIÇÕES */}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                {/* =========================
                                                    SELEÇÃO DO EXERCÍCIO
                                                    ========================= */}

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Exercício
                                                    </label>

                                                    <select

                                                        // ID do exercício selecionado.
                                                        value={
                                                            exercicio.exercicio_id
                                                        }

                                                        // Impede trocar um exercício
                                                        // que já fazia parte do treino.
                                                        disabled={
                                                            !exercicio.novo
                                                        }

                                                        // Atualiza o ID do exercício
                                                        // selecionado no array.
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "exercicio_id",
                                                                e.target.value
                                                            )
                                                        }

                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                    >

                                                        {/* Opção inicial vazia. */}
                                                        <option value="">
                                                            Selecione
                                                        </option>

                                                        {/* Percorre todos os exercícios
                                                            disponíveis no sistema. */}
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

                                                {/* =========================
                                                    CAMPO: SÉRIES
                                                    ========================= */}

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Séries
                                                    </label>

                                                    <input

                                                        // Permite digitar números.
                                                        type="number"

                                                        // Define o mínimo sugerido
                                                        // para o campo.
                                                        min="1"

                                                        // Quantidade de séries
                                                        // armazenada no estado.
                                                        value={
                                                            exercicio.series
                                                        }

                                                        // Atualiza as séries do exercício.
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "series",
                                                                e.target.value
                                                            )
                                                        }

                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                                    />

                                                </div>

                                                {/* =========================
                                                    CAMPO: REPETIÇÕES
                                                    ========================= */}

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                                        Repetições
                                                    </label>

                                                    <input

                                                        // Campo numérico.
                                                        type="number"

                                                        // Define o mínimo sugerido.
                                                        min="1"

                                                        // Quantidade de repetições
                                                        // armazenada no estado.
                                                        value={
                                                            exercicio.repeticoes
                                                        }

                                                        // Atualiza as repetições
                                                        // do exercício selecionado.
                                                        onChange={(e) =>
                                                            alterarExercicio(
                                                                index,
                                                                "repeticoes",
                                                                e.target.value
                                                            )
                                                        }

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

                    {/* =====================================
                        BOTÕES DO FORMULÁRIO
                        ===================================== */}

                    <div className="flex justify-end gap-4 pt-8 border-t">

                        {/* BOTÃO CANCELAR */}

                        {/* type="button" não envia o formulário.
                            disabled impede o cancelamento pelo botão
                            enquanto o salvamento está em andamento. */}
                        <button
                            type="button"

                            onClick={() =>
                                navigate("/treinos")
                            }

                            disabled={salvando}

                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        {/* BOTÃO SALVAR ALTERAÇÕES */}

                        {/* type="submit" executa o onSubmit do formulário.
                            disabled evita novos cliques durante o envio. */}
                        <button
                            type="submit"
                            disabled={salvando}

                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                            {/* Operador ternário que altera o texto
                                de acordo com o estado salvando. */}
                            {salvando
                                ? "Salvando..."
                                : "Salvar Alterações"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );
}
