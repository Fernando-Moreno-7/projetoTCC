import { useNavigate } from "react-router-dom";

import {
    User,
    Lock
} from "lucide-react";

export default function Login() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-md p-8">

                    <div className="text-center mb-8">

                        <h1 className="text-4xl font-bold text-purple-700">

                            EvolutionFit

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Acesse sua conta

                        </p>

                    </div>

                    <div className="space-y-6">

                        {/* E-mail */}

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">

                                E-mail

                            </label>

                            <div className="relative">

                                <User
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />

                                <input
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                        {/* Senha */}

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">

                                Senha

                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />

                                <input
                                    type="password"
                                    placeholder="Digite sua senha"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                        {/* Entrar */}

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-semibold transition"
                        >

                            Entrar

                        </button>

                        {/* Criar conta */}

                        <div className="text-center pt-2">

                            <p className="text-gray-500 text-sm">

                                Ainda não possui uma conta?

                            </p>

                            <button
                                onClick={() => navigate("/cadastrar-usuario")}
                                className="text-purple-700 hover:text-purple-900 font-semibold mt-1 transition"
                            >

                                Criar uma conta

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}