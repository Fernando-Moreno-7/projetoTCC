
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Dumbbell
} from "lucide-react";

// Componente responsável pelo cadastro de usuários
export default function CadastrarUsuario() {

    const navigate = useNavigate();

    // Estados dos campos do formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // Controla a visibilidade das senhas
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    // Controla o carregamento do cadastro
    const [carregando, setCarregando] = useState(false);

    // Função responsável por cadastrar o usuário
    async function handleCadastrar(e) {

        e.preventDefault();

        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
            alert("Preencha todos os campos!");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            setCarregando(true);

            // Envia os dados para o backend
            const response = await axios.post(
                "http://localhost:5000/user/register",
                {
                    nome,
                    email,
                    senha,
                    confSenha: confirmarSenha
                }
            );

            alert(response.data.message);

            // Limpa os campos após o cadastro
            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

            // Retorna para a tela de login
            navigate("/");

        } catch (error) {

            console.error("Erro ao cadastrar usuário:", error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar usuário!"
                );
            } else {
                alert("Não foi possível conectar ao servidor.");
            }

        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-700 via-purple-800 to-indigo-900 p-6">

            {/* Card principal */}
            <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

                {/* Cabeçalho */}
                <div className="mb-8 flex flex-col items-center">

                    {/* Ícone do aplicativo */}
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

                    <p className="mt-2 text-center text-sm text-gray-500">
                        Sistema de Gerenciamento de Academia
                    </p>

                    <h2 className="mt-6 text-2xl font-bold text-gray-800">
                        Criar Conta
                    </h2>

                    <p className="mt-2 text-center text-sm text-gray-500">
                        Preencha os dados para criar sua conta.
                    </p>

                </div>

                {/* Formulário de cadastro */}
                <form
                    onSubmit={handleCadastrar}
                    className="space-y-5"
                >

                    {/* Nome completo */}
                    <div>
                        <label
                            htmlFor="nome"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Nome Completo
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite seu nome completo"
                                autoComplete="name"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* E-mail */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            E-mail
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite seu e-mail"
                                autoComplete="email"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Senha */}
                    <div>
                        <label
                            htmlFor="senha"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Senha
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="senha"
                                type={mostrarSenha ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite sua senha"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-12 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500"
                            >
                                {mostrarSenha
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Confirmar senha */}
                    <div>
                        <label
                            htmlFor="confirmarSenha"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Confirmar Senha
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="confirmarSenha"
                                type={mostrarConfirmacao ? "text" : "password"}
                                value={confirmarSenha}
                                onChange={(e) =>
                                    setConfirmarSenha(e.target.value)
                                }
                                placeholder="Digite a senha novamente"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-12 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarConfirmacao(!mostrarConfirmacao)
                                }
                                aria-label={mostrarConfirmacao ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500"
                            >
                                {mostrarConfirmacao
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Botão de cadastro */}
                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full cursor-pointer rounded-xl bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
                    >
                        {carregando
                            ? "Cadastrando..."
                            : "Criar Conta"
                        }
                    </button>

                    {/* Voltar para login */}
                    <div className="text-center">

                        <p className="text-sm text-gray-500">
                            Já possui uma conta?
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mt-2 inline-flex cursor-pointer items-center gap-2 font-semibold text-purple-700 transition hover:text-purple-900"
                        >
                            <ArrowLeft size={18} />
                            Voltar para Login
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
