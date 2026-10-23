
import { useEffect, useState } from "react";

// Hooks responsáveis pela navegação e leitura de parâmetros da URL.
import { useNavigate, useParams } from "react-router-dom";

// Biblioteca utilizada para realizar requisições HTTP ao backend.
import axios from "axios";

// Layout padrão do EvolutionFit.
import Layout from "../../components/Layout/Layout";

// Ícones utilizados na interface.
import {
    ArrowLeft,
    Activity,
    FileText
} from "lucide-react";

export default function EditarExercicio() {

    // Permite navegar entre páginas sem recarregar toda a aplicação.
    const navigate = useNavigate();

    // Recupera o ID do exercício pelos parâmetros da URL.
    const { id } = useParams();

    // =========================================
    // ESTADOS DO FORMULÁRIO
    // =========================================

    // Armazena o nome do exercício.
    const [nome, setNome] = useState("");

    // Armazena o grupo muscular selecionado.
    const [grupoMuscular, setGrupoMuscular] = useState("");

    // Armazena a descrição do exercício.
    const [descricao, setDescricao] = useState("");

    // Controla o carregamento inicial dos dados.
    const [carregando, setCarregando] = useState(true);

    // Controla o estado de salvamento do formulário.
    const [salvando, setSalvando] = useState(false);

    // =========================================
    // BUSCAR EXERCÍCIO PELO ID
    // =========================================

    // Executa a busca quando o componente é montado
    // e novamente se alguma dependência mudar.
    useEffect(() => {

        // Função assíncrona que busca o exercício no backend.
        async function buscarExercicio() {

            try {

                // Faz uma requisição GET para buscar o exercício
                // identificado pelo ID recuperado da URL.
                const response = await axios.get(
                    `http://localhost:5000/exercicio/${id}`
                );

                // Obtém os dados retornados pelo backend.
                const exercicio = response.data;

                // Preenche os estados com os dados do exercício.
                // Caso algum valor seja falso, utiliza uma string vazia.
                setNome(exercicio.nome || "");
                setGrupoMuscular(exercicio.grupo_muscular || "");
                setDescricao(exercicio.descricao || "");

            } catch (error) {

                // Exibe o erro no console para facilitar a depuração.
                console.error(error);

                // Verifica se o servidor retornou uma resposta de erro.
                if (error.response) {
                    alert(
                        error.response.data.message ||
                        "Erro ao buscar exercício!"
                    );
                } else {

                    // Mensagem quando não foi recebida
                    // uma resposta HTTP do servidor.
                    alert("Não foi possível conectar ao servidor.");
                }

                // Em caso de erro, retorna à listagem de exercícios.
                navigate("/exercicios");

            } finally {

                // Encerra o estado de carregamento,
                // independentemente do resultado da busca.
                setCarregando(false);
            }
        }

        // Executa a função de busca.
        buscarExercicio();

        // Dependências monitoradas pelo useEffect.
    }, [id, navigate]);

    // =========================================
    // ATUALIZAR EXERCÍCIO
    // =========================================

    // Executada quando o formulário é enviado.
    async function handleEditarExercicio(e) {

        // Impede o envio padrão do formulário pelo navegador.
        e.preventDefault();

        // Valida se o nome foi preenchido.
        // trim() remove espaços do início e do final.
        if (!nome.trim()) {
            alert("Digite o nome do exercício!");

            // Interrompe a função se o nome estiver vazio.
            return;
        }

        // Valida se o grupo muscular foi selecionado.
        if (!grupoMuscular) {
            alert("Informe o grupo muscular!");
            return;
        }

        // Valida se a descrição foi preenchida.
        if (!descricao.trim()) {
            alert("Digite a descrição do exercício!");
            return;
        }

        try {

            // Indica que a atualização está em andamento.
            // O botão será desabilitado e exibirá "Salvando...".
            setSalvando(true);

            // Envia os dados atualizados ao backend
            // por meio de uma requisição POST.
            const response = await axios.post(
                "http://localhost:5000/exercicio/update",
                {
                    // ID do exercício que será atualizado.
                    idExercicio: id,

                    // Nome sem espaços extras nas extremidades.
                    nome: nome.trim(),

                    // Grupo muscular escolhido no select.
                    grupo_muscular: grupoMuscular,

                    // Descrição sem espaços extras nas extremidades.
                    descricao: descricao.trim()
                }
            );

            // Mostra a mensagem de sucesso retornada pelo backend.
            alert(response.data.message);

            // Após atualizar, retorna à listagem de exercícios.
            navigate("/exercicios");

        } catch (error) {

            // Registra o erro no console.
            console.error(error);

            // Trata erros que possuem resposta do backend.
            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Erro ao atualizar exercício!"
                );
            } else {

                // Trata situações sem resposta HTTP.
                alert("Não foi possível conectar ao servidor.");
            }

        } finally {

            // Finaliza o estado de salvamento.
            setSalvando(false);
        }
    }

    // =========================================
    // TELA DE CARREGAMENTO
    // =========================================

    // Enquanto os dados do exercício estão sendo buscados,
    // mostra uma mensagem no lugar do formulário.
    if (carregando) {
        return (
            <Layout>
                <p className="text-gray-500">
                    Carregando exercício...
                </p>
            </Layout>
        );
    }

    // =========================================
    // INTERFACE DO FORMULÁRIO
    // =========================================

    return (
        <Layout>

            {/* BOTÃO PARA VOLTAR À LISTAGEM */}
            <button
                onClick={() => navigate("/exercicios")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />
                Voltar para Exercícios
            </button>

            <div>

                {/* CABEÇALHO DA PÁGINA */}
                <div className="mb-8">

                    <h1 className="text-4xl font-bold">
                        Editar Exercício
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Altere as informações do exercício.
                    </p>

                </div>

                {/* FORMULÁRIO DE EDIÇÃO */}

                {/* onSubmit executa a função responsável
                    por validar e atualizar o exercício. */}
                <form
                    onSubmit={handleEditarExercicio}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    {/* =====================================
                        CAMPO: NOME DO EXERCÍCIO
                        ===================================== */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome do Exercício
                        </label>

                        <div className="relative">

                            {/* Ícone decorativo do campo. */}
                            <Activity
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"

                                // O valor exibido vem do estado nome.
                                value={nome}

                                // Atualiza o estado conforme o usuário digita.
                                onChange={(e) => setNome(e.target.value)}

                                // Exemplo apresentado no campo vazio.
                                placeholder="Ex: Supino Reto"

                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* =====================================
                        CAMPO: GRUPO MUSCULAR
                        ===================================== */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Grupo Muscular
                        </label>

                        {/* select apresenta opções predefinidas.
                            O valor selecionado é controlado pelo React. */}
                        <select
                            value={grupoMuscular}

                            // Atualiza o grupo muscular escolhido.
                            onChange={(e) =>
                                setGrupoMuscular(e.target.value)
                            }

                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >

                            {/* Opção inicial sem grupo selecionado. */}
                            <option value="">
                                Selecione o grupo muscular
                            </option>

                            <option value="Peito">
                                Peito
                            </option>

                            <option value="Costas">
                                Costas
                            </option>

                            <option value="Ombros">
                                Ombros
                            </option>

                            <option value="Biceps">
                                Bíceps
                            </option>

                            <option value="Triceps">
                                Tríceps
                            </option>

                            <option value="Pernas">
                                Pernas
                            </option>

                            <option value="Gluteos">
                                Glúteos
                            </option>

                            <option value="Abdomen">
                                Abdômen
                            </option>

                            <option value="Panturrilha">
                                Panturrilha
                            </option>

                        </select>

                    </div>

                    {/* =====================================
                        CAMPO: DESCRIÇÃO
                        ===================================== */}

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>

                        <div className="relative">

                            {/* Ícone decorativo da descrição. */}
                            <FileText
                                size={18}
                                className="absolute left-4 top-5 text-gray-400"
                            />

                            {/* textarea permite escrever textos
                                em várias linhas. */}
                            <textarea

                                // Define a altura inicial em cinco linhas.
                                rows="5"

                                // O texto exibido vem do estado descricao.
                                value={descricao}

                                // Atualiza o estado conforme o professor digita.
                                onChange={(e) =>
                                    setDescricao(e.target.value)
                                }

                                placeholder="Descreva como o exercício deve ser realizado..."

                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* =====================================
                        BOTÕES DO FORMULÁRIO
                        ===================================== */}

                    <div className="flex justify-end gap-4 pt-6 border-t">

                        {/* BOTÃO CANCELAR */}

                        {/* type="button" não envia o formulário.
                            onClick retorna à página de exercícios. */}
                        <button
                            type="button"
                            onClick={() => navigate("/exercicios")}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Cancelar
                        </button>

                        {/* BOTÃO SALVAR ALTERAÇÕES */}

                        {/* type="submit" aciona o onSubmit do formulário.
                            disabled impede novos cliques durante o salvamento. */}
                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                            {/* Texto exibido de acordo com o estado salvando. */}
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
