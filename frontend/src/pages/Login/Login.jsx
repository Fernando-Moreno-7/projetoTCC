import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Dumbbell
} from "lucide-react";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    async function handleLogin(e) {

        e.preventDefault();

        if (!email || !senha) {

            alert("Preencha o e-mail e a senha!");

            return;
        }

        try {

            setCarregando(true);

            const response = await axios.post(
                "http://localhost:5000/login",
                {
                    email,
                    password: senha
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "userId",
                response.data.userId
            );

            alert(response.data.message);

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao realizar login!"
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

        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 flex items-center justify-center p-6">

            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">

                <div className="flex flex-col items-center mb-10">

                    <div className="bg-purple-700 w-24 h-24 rounded-full flex items-center justify-center shadow-xl">

                        <Dumbbell
                            size={42}
                            className="text-white"
                        />

                    </div>

                    <h1 className="text-4xl font-bold text-purple-700 mt-6">

                        EvolutionFit

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Sistema de Gerenciamento de Academia

                    </p>

                </div>

                <form
                    onSubmit={handleLogin}
                    className="space-y-6"
                >

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
                                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                                type={mostrarSenha ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite sua senha"
                                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                            >

                                {mostrarSenha
                                    ? <EyeOff size={20} />
                                    : <Eye size={20} />
                                }

                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={carregando}
                        className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-semibold py-3 rounded-xl transition"
                    >

                        {carregando
                            ? "Entrando..."
                            : "Entrar"
                        }

                    </button>

                    <div className="text-center">

                        <p className="text-gray-500 text-sm">

                            Ainda não possui uma conta?

                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/cadastrar-usuario")}
                            className="text-purple-700 hover:text-purple-900 font-semibold mt-1 transition"
                        >

                            Criar uma conta

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}