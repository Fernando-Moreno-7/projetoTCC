import { Play, Dumbbell } from "lucide-react";


import Button from "../Button/Button";



export default function TreinoHoje() {

    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-6">

                <Dumbbell
                    className="text-purple-700"
                    size={28}
                />

                <h2 className="text-2xl font-bold">

                    Treino de Hoje

                </h2>

            </div>

            <div className="space-y-2">

                <h3 className="text-xl font-semibold">

                    Treino A

                </h3>

                <p className="text-gray-500">

                    Peito e Tríceps

                </p>

                <p className="text-gray-600">

                    Exercícios: 8

                </p>

            </div>

            <div className="mt-8">

                <Button>

                    <div className="flex items-center justify-center gap-2">

                        <Play size={18} />

                        Iniciar Treino

                    </div>

                </Button>

            </div>

        </div>

    );

}