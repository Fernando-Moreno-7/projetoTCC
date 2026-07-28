import Layout from "../../components/Layout/Layout";
import ExercicioItem from "../../components/ExercicioItem/ExercicioItem";

export default function CadastrarTreino() {

    return (

        <Layout>

            <div>

                <h1 className="text-4xl font-bold">
                    Cadastrar Treino
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Cadastre um novo treino para seus alunos.
                </p>

                <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome do Treino
                        </label>

                        <input
                            type="text"
                            placeholder="Ex.: Treino A"
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>

                        <textarea
                            rows="4"
                            placeholder="Descreva o treino..."
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Grupo Muscular
                        </label>

                        <select className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-600">

                            <option>Peito</option>
                            <option>Costas</option>
                            <option>Pernas</option>
                            <option>Ombros</option>
                            <option>Braços</option>
                            <option>Abdômen</option>

                        </select>

                    </div>

                    <div className="border-t pt-8">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold">
                                Exercícios
                            </h2>

                            <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition">

                                + Adicionar Exercício

                            </button>

                        </div>

                        <div className="space-y-4">

                            <ExercicioItem />
                            <ExercicioItem />

                        </div>

                    </div>

                    <div className="flex justify-end pt-8">

                        <button className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-xl font-semibold transition">

                            Salvar Treino

                        </button>

                    </div>

                </div>

            </div>

        </Layout>

    );

}