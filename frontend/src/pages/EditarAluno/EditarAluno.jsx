
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Layout padrão utilizado nas páginas do sistema.
import Layout from "../../components/Layout/Layout";

// Ícones utilizados nos campos e botões.
import {
    ArrowLeft,
    User,
    Lock,
    Calendar,
    Ruler,
    Weight,
    Target,
    Phone,
    Activity
} from "lucide-react";

// Componente responsável pela edição dos dados de um aluno.
export default function EditarAluno() {

    // Permite navegar para outras páginas do aplicativo.
    const navigate = useNavigate();

    // Obtém o ID do aluno presente nos parâmetros da URL.
    const { id } = useParams();

    // Estados que armazenam os valores dos campos do formulário.
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [idade, setIdade] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [telefone, setTelefone] = useState("");

    // O status começa com o valor padrão "Ativo".
    const [status, setStatus] = useState("Ativo");

    // Controla o carregamento inicial dos dados do aluno.
    const [carregando, setCarregando] = useState(true);

    // Indica se uma atualização está sendo enviada ao backend.
    const [salvando, setSalvando] = useState(false);

    // Executa a busca do aluno quando o componente é montado.
    // O array vazio indica que o efeito não depende de estados.
    useEffect(() => {
        buscarAluno();
    }, []);

    // Função assíncrona responsável por buscar os dados do aluno.
    async function buscarAluno() {
        try {
            // Faz uma requisição HTTP GET ao backend.
            // O ID na URL identifica o aluno que será consultado.
            const response = await axios.get(
                `http://localhost:5000/user/${id}`
            );

            // Obtém os dados retornados pelo backend.
            const aluno = response.data;

            // Preenche os estados com os dados encontrados.
            // O operador || fornece um valor alternativo
            // caso o primeiro valor seja falsy.
            setNome(aluno.nome || "");
            setIdade(aluno.idade || "");
            setAltura(aluno.altura || "");
            setPeso(aluno.peso || "");
            setObjetivo(aluno.objetivo || "");
            setTelefone(aluno.telefone || "");
            setStatus(aluno.status || "Ativo");

        } catch (error) {
            // Captura erros que ocorram durante a busca.
            console.error(error);

            // Informa ao usuário que a busca falhou.
            alert("Erro ao buscar os dados do aluno!");

            // Retorna à listagem de alunos.
            navigate("/alunos");

        } finally {
            // Encerra o carregamento, com sucesso ou erro.
            setCarregando(false);
        }
    }

    // Função executada quando o formulário é enviado.
    async function handleEditarAluno(e) {

        // Impede o recarregamento padrão da página.
        e.preventDefault();

        // Verifica se o nome foi preenchido.
        if (!nome) {
            alert("Preencha o nome do aluno!");

            // Interrompe a função se o nome estiver vazio.
            return;
        }

        // =====================================
        // VALIDAR SENHA SOMENTE SE FOR ALTERADA
        // =====================================

        // Só verifica as senhas se algum dos campos foi preenchido.
        // Assim, o professor pode editar os outros dados
        // sem precisar modificar a senha do aluno.
        if (senha || confirmarSenha) {

            // Se um campo estiver preenchido e o outro não,
            // a atualização será interrompida.
            if (!senha || !confirmarSenha) {
                alert("Preencha a nova senha e a confirmação!");
                return;
            }

            // O operador !== verifica se as senhas são diferentes.
            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }
        }

        try {
            // Informa ao React que o salvamento começou.
            setSalvando(true);

            // Envia uma requisição HTTP POST ao backend.
            // Os dados são enviados no corpo da requisição.
            const response = await axios.post(
                "http://localhost:5000/user/update",
                {
                    // Converte o ID recebido da URL em número.
                    idUsuario: Number(id),

                    // Envia o nome e os dados de senha.
                    nome,
                    senha,
                    confSenha: confirmarSenha,

                    // Converte campos preenchidos em números.
                    // Se estiverem vazios, envia null.
                    idade: idade ? Number(idade) : null,
                    altura: altura ? Number(altura) : null,
                    peso: peso ? Number(peso) : null,

                    // Envia os campos opcionais ou null.
                    objetivo: objetivo || null,
                    telefone: telefone || null,

                    // Envia o status selecionado.
                    status
                }
            );

            // Exibe a mensagem retornada pelo backend.
            alert(response.data.message);

            // Após o sucesso, retorna à listagem de alunos.
            navigate("/alunos");

        } catch (error) {
            // Registra o erro no console.
            console.error(error);

            // Verifica se o servidor retornou uma resposta de erro.
            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Erro ao atualizar aluno!"
                );
            } else {
                // Mensagem utilizada quando não há resposta
                // do servidor, como em uma falha de conexão.
                alert("Não foi possível conectar ao servidor.");
            }

        } finally {
            // Finaliza o estado de salvamento,
            // independentemente do resultado da requisição.
            setSalvando(false);
        }
    }

    // Enquanto os dados estão sendo buscados,
    // mostra uma mensagem em vez do formulário.
    if (carregando) {
        return (
            <Layout>
                <p className="text-gray-500">
                    Carregando aluno...
                </p>
            </Layout>
        );
    }

    // Interface exibida após o carregamento dos dados.
    return (
        <Layout>

            {/* Botão para voltar à página de alunos. */}
            <button
                onClick={() => navigate("/alunos")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />
                <span>Voltar para Alunos</span>
            </button>

            <div>
                {/* Título e descrição da página. */}
                <h1 className="text-4xl font-bold">
                    Editar Aluno
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Atualize os dados do aluno.
                </p>

                {/*
                    O onSubmit executa handleEditarAluno
                    quando o formulário é enviado.
                */}
                <form
                    onSubmit={handleEditarAluno}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    {/* Campo para editar o nome do aluno. */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Nome Completo
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            {/*
                                value mostra o valor do estado nome.
                                onChange captura o texto digitado.
                                setNome atualiza o estado no React.
                            */}
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite o nome do aluno"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>
                    </div>

                    {/* Campos para alteração opcional da senha. */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* Campo da nova senha. */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Nova Senha
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                {/*
                                    type="password" oculta os caracteres.
                                    A senha pode ficar vazia quando
                                    o professor não quiser alterá-la.
                                */}
                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Deixe em branco para manter"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>

                        {/* Campo de confirmação da nova senha. */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Confirmar Senha
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="password"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    placeholder="Confirme somente se alterar"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Orientação sobre a alteração opcional de senha. */}
                    <p className="text-sm text-gray-500">
                        Deixe os campos de senha em branco caso não queira alterar a senha do aluno.
                    </p>

                    {/* Campos de telefone e status do aluno. */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* Campo de telefone. */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Telefone
                            </label>

                            <div className="relative">
                                <Phone
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    placeholder="Ex.: (16) 99999-9999"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>

                        {/* Campo de seleção do status do aluno. */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Status
                            </label>

                            <div className="relative">
                                <Activity
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                {/*
                                    O select permite escolher entre
                                    os status Ativo e Inativo.
                                */}
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Campos de idade, altura e peso. */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* Campo de idade. */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Idade
                            </label>

                            <div className="relative">
                                <Calendar
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                {/*
                                    type="number" indica um campo numérico.
                                    O valor digitado atualiza o estado idade.
                                */}
                                <input
                                    type="number"
                                    value={idade}
                                    onChange={(e) => setIdade(e.target.value)}
                                    placeholder="Ex.: 23"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>

                        {/* Campo de altura em centímetros. */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Altura (cm)
                            </label>

                            <div className="relative">
                                <Ruler
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="number"
                                    value={altura}
                                    onChange={(e) => setAltura(e.target.value)}
                                    placeholder="Ex.: 175"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>

                        {/* Campo de peso em quilogramas. */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Peso (kg)
                            </label>

                            <div className="relative">
                                <Weight
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                {/*
                                    step="0.1" permite valores decimais
                                    com incrementos de 0,1 no campo.
                                */}
                                <input
                                    type="number"
                                    step="0.1"
                                    value={peso}
                                    onChange={(e) => setPeso(e.target.value)}
                                    placeholder="Ex.: 80"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Campo de seleção do objetivo do aluno. */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Objetivo
                        </label>

                        <div className="relative">
                            <Target
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            {/*
                                O select oferece opções predefinidas
                                para o objetivo de treinamento.
                            */}
                            <select
                                value={objetivo}
                                onChange={(e) => setObjetivo(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                                <option value="">Selecione o objetivo</option>
                                <option value="Hipertrofia">Hipertrofia</option>
                                <option value="Emagrecimento">Emagrecimento</option>
                                <option value="Condicionamento">Condicionamento</option>
                                <option value="Definição">Definição</option>
                            </select>
                        </div>
                    </div>

                    {/* Botões de cancelamento e salvamento. */}
                    <div className="flex justify-end gap-4 pt-8 border-t">

                        {/*
                            type="button" impede que o botão
                            Cancelar envie o formulário.
                        */}
                        <button
                            type="button"
                            onClick={() => navigate("/alunos")}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Cancelar
                        </button>

                        {/*
                            type="submit" envia o formulário.
                            disabled={salvando} impede novos cliques
                            enquanto a atualização está em andamento.
                        */}
                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >
                            {/*
                                Operador ternário:
                                se estiver salvando, mostra "Salvando...";
                                caso contrário, mostra "Salvar Alterações".
                            */}
                            {
                                salvando
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
