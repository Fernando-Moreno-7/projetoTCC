import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    ArrowLeft,
    User,
    Mail,
    Lock
} from "lucide-react";

export default function CadastrarUsuario() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleCadastrar(e) {

        e.preventDefault();

        if (!nome || !email || !senha || !confirmarSenha) {

            alert("Preencha todos os campos!");

            return;
        }

        if (senha !== confirmarSenha) {

            alert("As senhas não coincidem!");

            return;
        }

        try {

            setCarregando(true);

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

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

            navigate("/");

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar usuário!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        } finally {

            setCarregando(false);

        }
    }

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="w-full max-w-2xl">

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
                >

                    <ArrowLeft size={20} />

                    <span>Voltar para Login</span>

                </button>

                <div className="bg-white rounded-2xl shadow-md p-8">

                    <div className="mb-8">

                        <h1 className="text-4xl font-bold">

                            Criar Conta

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Cadastre um novo usuário no EvolutionFit.

                        </p>

                    </div>

                    <form
                        onSubmit={handleCadastrar}
                        className="space-y-6"
                    >

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">

                                Nome Completo

                            </label>

                            <div className="relative">

                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Digite seu nome completo"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">

                                E-mail

                            </label>

                            <div className="relative">

                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite seu e-mail"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">

                                Senha

                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Digite sua senha"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

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
                                    onChange={(e) =>
                                        setConfirmarSenha(e.target.value)
                                    }
                                    placeholder="Digite a senha novamente"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                        <div className="flex justify-end pt-6 border-t">

                            <button
                                type="submit"
                                disabled={carregando}
                                className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                            >

                                {carregando
                                    ? "Cadastrando..."
                                    : "Criar Conta"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}