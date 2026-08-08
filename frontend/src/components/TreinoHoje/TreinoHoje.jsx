import { Play, Dumbbell } from "lucide-react";

import Button from "../Button/Button";

export default function TreinoHoje() {

    const exercicios = [
        {
            nome: "Supino reto",
            series: 4,
            repeticoes: 12
        },
        {
            nome: "Supino inclinado",
            series: 3,
            repeticoes: 10
        },
        {
            nome: "Crucifixo",
            series: 3,
            repeticoes: 12
        },
        {
            nome: "Tríceps pulley",
            series: 4,
            repeticoes: 12
        }
    ];

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

            </div>

            <div className="mt-6 space-y-3">

                <h4 className="font-semibold text-gray-700">

                    Exercícios

                </h4>

                {exercicios.map((exercicio, index) => (

                    <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                    >

                        <div className="flex items-center gap-3">

                            <Dumbbell
                                size={20}
                                className="text-purple-700"
                            />

                            <span className="font-medium">

                                {exercicio.nome}

                            </span>

                        </div>

                        <span className="text-gray-600">

                            {exercicio.series} × {exercicio.repeticoes}

                        </span>

                    </div>

                ))}

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