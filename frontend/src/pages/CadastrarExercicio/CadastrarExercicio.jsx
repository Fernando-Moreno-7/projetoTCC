// Importa o hook useState para controlar os estados do formulário
import { useState } from "react";

// Importa o hook para navegar entre as páginas
import { useNavigate } from "react-router-dom";

// Biblioteca responsável pelas requisições HTTP ao backend
import axios from "axios";

// Importa o layout padrão do EvolutionFit
import Layout from "../../components/Layout/Layout";

// Importa os ícones utilizados na interface
import {
    ArrowLeft,
    Activity,
    FileText
} from "lucide-react";

// Componente responsável pelo cadastro de exercícios
export default function CadastrarExercicio() {

    // Permite redirecionar o usuário para outras páginas
    const navigate = useNavigate();

    // Estados que armazenam os dados digitados no formulário
    // Todos começam com strings vazias
    const [nome, setNome] = useState("");
    const [grupoMuscular, setGrupoMuscular] = useState("");
    const [descricao, setDescricao] = useState("");

    // Controla se o exercício está sendo cadastrado
    const [salvando, setSalvando] = useState(false);

    // Função assíncrona responsável por cadastrar o exercício
    async function handleCadastrarExercicio(e) {

        // Impede que o formulário recarregue a página
        e.preventDefault();

        // Verifica se o nome foi preenchido
        // trim() remove espaços do início e do final do texto
        if (!nome.trim()) {
            alert("Digite o nome do exercício!");

            // Interrompe a função se o nome estiver vazio
            return;
        }

        // Verifica se o grupo muscular foi selecionado
        if (!grupoMuscular) {
            alert("Informe o grupo muscular!");
            return;
        }

        // Verifica se a descrição foi preenchida
        if (!descricao.trim()) {
            alert("Digite a descrição do exercício!");
            return;
        }

        try {

            // Indica que o cadastro está em andamento
            setSalvando(true);

            // Envia os dados do exercício ao backend
            // await aguarda a resposta da requisição
            const response = await axios.post(
                "http://localhost:5000/exercicio/create",
                {
                    // Nome sem espaços desnecessários
                    nome: nome.trim(),

                    // Grupo muscular selecionado
                    grupo_muscular: grupoMuscular,

                    // Descrição sem espaços nas extremidades
                    descricao: descricao.trim()
                }
            );

            // Exibe a mensagem retornada pelo backend
            alert(response.data.message);

            // Redireciona para a página de exercícios
            navigate("/exercicios");

        } catch (error) {

            // Captura e registra possíveis erros
            console.error(error);

            // Verifica se o backend retornou uma resposta de erro
            if (error.response) {

                // Exibe a mensagem retornada pelo backend
                // ou uma mensagem padrão
                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar exercício!"
                );

            } else {

                // Exibe uma mensagem caso não receba resposta do servidor
                alert("Não foi possível conectar ao servidor.");
            }

        } finally {

            // Finaliza o estado de salvamento
            // Executa independentemente de sucesso ou erro
            setSalvando(false);
        }
    }

    // Retorna a interface da página
    return (
        <Layout>

            {/* Botão para voltar à página de exercícios */}
            <button
                onClick={() => navigate("/exercicios")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />
                Voltar para Exercícios
            </button>

            <div>

                {/* Cabeçalho da página */}
                <div className="mb-8">

                    <h1 className="text-4xl font-bold">
                        Cadastrar Exercício
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Cadastre um novo exercício para utilizar nos treinos.
                    </p>

                </div>

                {/* Formulário de cadastro */}
                {/* onSubmit chama a função de cadastro */}
                <form
                    onSubmit={handleCadastrarExercicio}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    {/* Campo para informar o nome do exercício */}
                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome do Exercício
                        </label>

                        <div className="relative">

                            {/* Ícone do campo de nome */}
                            <Activity
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            {/* Campo de texto controlado pelo estado nome */}
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: Supino Reto"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* Campo para selecionar o grupo muscular */}
                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Grupo Muscular
                        </label>

                        {/* Lista de opções de grupos musculares */}
                        <select
                            value={grupoMuscular}
                            onChange={(e) => setGrupoMuscular(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >

                            {/* Opção inicial sem valor selecionado */}
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

                    {/* Campo de descrição do exercício */}
                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>

                        <div className="relative">

                            {/* Ícone do campo de descrição */}
                            <FileText
                                size={18}
                                className="absolute left-4 top-5 text-gray-400"
                            />

                            {/* Campo de texto com múltiplas linhas */}
                            <textarea
                                rows="5"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Descreva como o exercício deve ser realizado..."
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* Área dos botões do formulário */}
                    <div className="flex justify-end gap-4 pt-6 border-t">

                        {/* Botão comum que cancela o cadastro */}
                        <button
                            type="button"
                            onClick={() => navigate("/exercicios")}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Cancelar
                        </button>

                        {/* Botão que envia o formulário */}
                        {/* Fica desabilitado enquanto o cadastro está em andamento */}
                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                            {/* Altera o texto de acordo com o estado salvando */}
                            {salvando
                                ? "Cadastrando..."
                                : "Cadastrar Exercício"}

                        </button>

                    </div>

                </form>

            </div>

        </Layout>
    );
}