import { useState } from "react";

import {
    Dumbbell,
    Mail,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

export default function Login() {

    const [mostrarSenha, setMostrarSenha] = useState(false);

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

                <form className="space-y-6">

                    <Input
                        icon={<Mail size={18} />}
                        label="E-mail"
                        type="email"
                        placeholder="Digite seu e-mail"
                    />

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

                                type={mostrarSenha ? "text" : "password"}

                                placeholder="Digite sua senha"

                                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-600"

                            />

                            <button

                                type="button"

                                onClick={() =>
                                    setMostrarSenha(!mostrarSenha)
                                }

                                className="absolute right-4 top-3 text-gray-500"

                            >

                                {mostrarSenha ?

                                    <EyeOff size={20} />

                                    :

                                    <Eye size={20} />

                                }

                            </button>

                        </div>

                    </div>

                    <Button>

                        Entrar

                    </Button>

                    <div className="text-center">

                        <button

                            type="button"

                            className="text-purple-700 hover:underline text-sm"

                        >

                            Esqueci minha senha

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}