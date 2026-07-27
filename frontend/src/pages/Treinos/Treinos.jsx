import Layout from "../../components/Layout/Layout";
import TreinoCard from "../../components/TreinoCard/TreinoCard";

export default function Treinos() {

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">

                            Treinos

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Gerencie todos os treinos cadastrados.

                        </p>

                    </div>

                    <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition">

                        + Novo Treino

                    </button>

                </div>

                <div className="grid gap-6">

                    <TreinoCard
                        nome="Treino A"
                        descricao="Peito e Tríceps"
                        exercicios={8}
                    />

                    <TreinoCard
                        nome="Treino B"
                        descricao="Costas e Bíceps"
                        exercicios={7}
                    />

                    <TreinoCard
                        nome="Treino C"
                        descricao="Pernas"
                        exercicios={9}
                    />

                </div>

            </div>

        </Layout>

    );

}