import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";
import ExercicioItem from "../../components/ExercicioItem/ExercicioItem";

import {
    Dumbbell,
    FileText,
    Target,
    ArrowLeft
} from "lucide-react";

export default function CadastrarTreino() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSalvarTreino(e) {

        e.preventDefault();

        if (!nome) {
            alert("Digite o nome do treino!");
            return;
        }

        try {

            setCarregando(true);

            const response = await axios.post(
                "http://localhost:5000/treino/create",
                {
                    nome,
                    descricao
                }
            );

            alert(response.data.message);

            navigate("/treinos");

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar treino!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }

        } finally {

            setCarregando(false);

        }
    }

    return (

        <Layout>

            <button
                onClick={() => navigate("/treinos")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />

                <span>Voltar para Treinos</span>
            </button>

            <div>

                <h1 className="text-4xl font-bold">
                    Cadastrar Treino
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Cadastre um novo treino para seus alunos.
                </p>

                <form
                    onSubmit={handleSalvarTreino}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome do Treino
                        </label>

                        <div className="relative">

                            <Dumbbell
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex.: Treino A"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>

                        <div className="relative">

                            <FileText
                                size={18}
                                className="absolute left-4 top-6 text-gray-400"
                            />

                            <textarea
                                rows="4"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Descreva o treino..."
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Grupo Muscular
                        </label>

                        <div className="relative">

                            <Target
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <select
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                                <option>Peito</option>
                                <option>Costas</option>
                                <option>Pernas</option>
                                <option>Ombros</option>
                                <option>Braços</option>
                                <option>Abdômen</option>
                            </select>

                        </div>

                    </div>

                    <div className="border-t pt-8">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold">
                                Exercícios
                            </h2>

                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
                            >
                                + Adicionar Exercício
                            </button>

                        </div>

                        <div className="space-y-4">

                            <ExercicioItem numero={1} />

                            <ExercicioItem numero={2} />

                        </div>

                    </div>

                    <div className="flex justify-end gap-4 pt-8 border-t">

                        <button
                            type="button"
                            onClick={() => navigate("/treinos")}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={carregando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >
                            {carregando
                                ? "Salvando..."
                                : "Salvar Treino"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );
}