import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    ArrowLeft,
    Dumbbell,
    FileText
} from "lucide-react";

export default function EditarTreino() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {

        buscarTreino();

    }, []);

    async function buscarTreino() {

        try {

            const response = await axios.get(
                `http://localhost:5000/treino/${id}`
            );

            const treino = response.data;

            setNome(treino.nome || "");
            setDescricao(treino.descricao || "");

        } catch (error) {

            console.error(error);

            alert("Erro ao buscar os dados do treino!");

            navigate("/treinos");

        } finally {

            setCarregando(false);

        }
    }

    async function handleEditarTreino(e) {

        e.preventDefault();

        if (!nome) {

            alert("Digite o nome do treino!");

            return;
        }

        try {

            setSalvando(true);

            const response = await axios.post(
                "http://localhost:5000/treino/update",
                {
                    idTreino: Number(id),
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
                    "Erro ao atualizar treino!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }

        } finally {

            setSalvando(false);

        }
    }

    if (carregando) {

        return (

            <Layout>

                <p className="text-gray-500">
                    Carregando treino...
                </p>

            </Layout>

        );

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
                    Editar Treino
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Atualize os dados do treino.
                </p>

                <form
                    onSubmit={handleEditarTreino}
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
                                placeholder="Digite o nome do treino"
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
                            disabled={salvando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >
                            {salvando
                                ? "Salvando..."
                                : "Salvar Alterações"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );
}