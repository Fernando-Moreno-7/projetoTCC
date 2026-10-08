
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importa os ícones utilizados na tela de login
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Dumbbell
} from "lucide-react";

// Componente responsável pela tela de login do EvolutionFit
export default function Login() {

    // Permite navegar entre as páginas do aplicativo
    const navigate = useNavigate();

    // Armazena o e-mail digitado pelo usuário
    const [email, setEmail] = useState("");

    // Armazena a senha digitada pelo usuário
    const [senha, setSenha] = useState("");

    // Controla se a senha será exibida ou escondida
    const [mostrarSenha, setMostrarSenha] = useState(false);

    // Controla o estado de carregamento durante o login
    const [carregando, setCarregando] = useState(false);

    // Função responsável por processar o login do usuário
    async function handleLogin(e) {

        // Impede o recarregamento padrão da página ao enviar o formulário
        e.preventDefault();

        // Verifica se o e-mail ou a senha estão vazios
        if (!email || !senha) {
            alert("Preencha o e-mail e a senha!");

            // Interrompe a função caso algum campo esteja vazio
            return;
        }

        try {

            // Informa que o processo de login começou
            setCarregando(true);

            // Envia o e-mail e a senha para o backend utilizando Axios
            // O await espera a resposta da requisição
            // A variável response armazena a resposta recebida
            const response = await axios.post(
                "http://localhost:5000/login",
                {
                    email,
                    password: senha
                }
            );

            // Salva o token de autenticação no navegador
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Salva o ID do usuário que realizou o login
            localStorage.setItem(
                "userId",
                response.data.userId
            );

            // Salva o tipo de usuário recebido do backend
            localStorage.setItem(
                "tipoUsuario",
                response.data.tipoUsuario
            );

            // Exibe a mensagem de sucesso retornada pelo backend
            alert(response.data.message);

            // Direciona o usuário para a tela do Dashboard
            navigate("/dashboard");

        } catch (error) {

            // Exibe informações do erro no console do navegador
            console.error("Erro no login:", error);

            // Verifica se o backend retornou uma resposta de erro
            if (error.response) {

                // Exibe a mensagem retornada pelo backend
                // Caso não exista uma mensagem, utiliza o texto alternativo
                alert(
                    error.response.data.message ||
                    "Erro ao realizar login!"
                );

            } else {

                // Exibe uma mensagem quando não há resposta do servidor
                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        } finally {

            // Finaliza o estado de carregamento,
            // independentemente de o login ter dado certo ou errado
            setCarregando(false);

        }
    }

    // Retorna o JSX responsável pela interface visual da tela
    return (

        // Container principal com fundo em gradiente e conteúdo centralizado
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-700 via-purple-800 to-indigo-900 p-6">

            {/* Card branco que contém o formulário de login */}
            <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

                {/* Cabeçalho com ícone, nome e descrição do aplicativo */}
                <div className="mb-10 flex flex-col items-center">

                    {/* Círculo roxo que contém o ícone da academia */}
                    <div className="flex size-24 items-center justify-center rounded-full bg-purple-700 shadow-xl">

                        <Dumbbell
                            size={42}
                            className="text-white"
                        />

                    </div>

                    {/* Nome do aplicativo */}
                    <h1 className="mt-6 text-4xl font-bold text-purple-700">
                        EvolutionFit
                    </h1>

                    {/* Descrição do sistema */}
                    <p className="mt-2 text-gray-500">
                        Sistema de Gerenciamento de Academia
                    </p>

                </div>

                {/* Formulário que executa handleLogin ao ser enviado */}
                <form
                    onSubmit={handleLogin}
                    className="space-y-6"
                >

                    {/* Campo de e-mail */}
                    <div>

                        <label className="mb-2 block font-medium text-gray-700">
                            E-mail
                        </label>

                        <div className="relative">

                            {/* Ícone de e-mail */}
                            <Mail
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            />

                            {/* Campo que recebe o e-mail do usuário */}
                            <input
                                type="email"

                                // Mostra o valor armazenado no estado email
                                value={email}

                                // Atualiza o estado quando o usuário digita
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }

                                placeholder="Digite seu e-mail"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />

                        </div>

                    </div>

                    {/* Campo de senha */}
                    <div>

                        <label className="mb-2 block font-medium text-gray-700">
                            Senha
                        </label>

                        <div className="relative">

                            {/* Ícone de cadeado */}
                            <Lock
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            />

                            {/* Campo que recebe a senha do usuário */}
                            <input

                                // Alterna entre mostrar e esconder a senha
                                type={
                                    mostrarSenha
                                        ? "text"
                                        : "password"
                                }

                                // Mostra o valor armazenado no estado senha
                                value={senha}

                                // Atualiza o estado quando o usuário digita
                                onChange={(e) =>
                                    setSenha(e.target.value)
                                }

                                placeholder="Digite sua senha"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-12 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />

                            {/* Botão responsável por mostrar ou esconder a senha */}
                            <button
                                type="button"

                                // Inverte o estado mostrarSenha ao clicar
                                onClick={() =>
                                    setMostrarSenha(!mostrarSenha)
                                }

                                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500"
                            >

                                {/* Alterna o ícone conforme a visibilidade da senha */}
                                {mostrarSenha
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }

                            </button>

                        </div>

                    </div>

                    {/* Botão responsável por enviar o formulário de login */}
                    <button
                        type="submit"

                        // Desabilita o botão enquanto o login está carregando
                        disabled={carregando}

                        className="w-full cursor-pointer rounded-xl bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:bg-purple-400"
                    >

                        {/* Altera o texto conforme o estado de carregamento */}
                        {carregando
                            ? "Entrando..."
                            : "Entrar"
                        }

                    </button>

                    {/* Área de navegação para a tela de cadastro */}
                    <div className="text-center">

                        <p className="text-sm text-gray-500">
                            Ainda não possui uma conta?
                        </p>

                        {/* Botão que direciona para o cadastro de usuários */}
                        <button
                            type="button"

                            // Navega para a tela de cadastro
                            onClick={() =>
                                navigate("/cadastrar-usuario")
                            }

                            className="mt-1 cursor-pointer font-semibold text-purple-700 transition hover:text-purple-900"
                        >
                            Criar uma conta
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
