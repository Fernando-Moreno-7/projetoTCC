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

            localStorage.setItem(
                "tipoUsuario",
                response.data.tipoUsuario
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

        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-700 via-purple-800 to-indigo-900 p-6">

            <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">

                <div className="mb-10 flex flex-col items-center">

                    <div className="flex size-24 items-center justify-center rounded-full bg-purple-700 shadow-xl">

                        <Dumbbell
                            size={42}
                            className="text-white"
                        />

                    </div>

                    <h1 className="mt-6 text-4xl font-bold text-purple-700">
                        EvolutionFit
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Sistema de Gerenciamento de Academia
                    </p>

                </div>


                <form
                    onSubmit={handleLogin}
                    className="space-y-6"
                >

                    <div>

                        <label className="mb-2 block font-medium text-gray-700">
                            E-mail
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Digite seu e-mail"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />

                        </div>

                    </div>


                    <div>

                        <label className="mb-2 block font-medium text-gray-700">
                            Senha
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={
                                    mostrarSenha
                                        ? "text"
                                        : "password"
                                }
                                value={senha}
                                onChange={(e) =>
                                    setSenha(e.target.value)
                                }
                                placeholder="Digite sua senha"
                                className="w-full rounded-xl border border-gray-300 py-3 pr-12 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarSenha(!mostrarSenha)
                                }
                                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500"
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
                        className="w-full cursor-pointer rounded-xl bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:bg-purple-400"
                    >

                        {carregando
                            ? "Entrando..."
                            : "Entrar"
                        }

                    </button>


                    <div className="text-center">

                        <p className="text-sm text-gray-500">
                            Ainda não possui uma conta?
                        </p>

                        <button
                            type="button"
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