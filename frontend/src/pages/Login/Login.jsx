import { FaDumbbell } from "react-icons/fa";

import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

export default function Login() {

    return (

        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-700 to-purple-900">

            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">

                <div className="flex flex-col items-center mb-8">

                    <div className="bg-purple-700 text-white p-5 rounded-full shadow-lg">

                        <FaDumbbell size={35} />

                    </div>

                    <h1 className="text-4xl font-bold text-purple-700 mt-5">
                        EvolutionFit
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Sistema de Gerenciamento de Academia
                    </p>

                </div>

                <form className="space-y-5">

                    <Input
                        label="E-mail"
                        type="email"
                        placeholder="Digite seu e-mail"
                    />

                    <Input
                        label="Senha"
                        type="password"
                        placeholder="Digite sua senha"
                    />

                    <Button>
                        Entrar
                    </Button>

                    <p className="text-center text-sm text-purple-700 hover:underline cursor-pointer">

                        Esqueci minha senha

                    </p>

                </form>

            </div>

        </div>

    );

}