import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";
import ExercicioCard from "../../components/ExercicioCard/ExercicioCard";

import {
    Plus,
    Search
} from "lucide-react";

export default function Exercicios() {

    const navigate = useNavigate();

    const [exercicios, setExercicios] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [carregando, setCarregando] = useState(true);


    useEffect(() => {

        buscarExercicios();

    }, []);


    async function buscarExercicios() {

        try {

            setCarregando(true);

            const response = await axios.get(
                "http://localhost:5000/exercicio/list"
            );

            setExercicios(response.data);

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao buscar exercícios!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }

        } finally {

            setCarregando(false);

        }
    }


    async function handleExcluirExercicio(id) {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este exercício?"
        );

        if (!confirmar) {
            return;
        }

        try {

            const response = await axios.delete(
                "http://localhost:5000/exercicio/delete",
                {
                    data: {
                        idExercicio: id
                    }
                }
            );

            alert(response.data.message);

            setExercicios((exerciciosAtuais) =>
                exerciciosAtuais.filter(
                    (exercicio) => exercicio.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao excluir exercício!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }
        }
    }


    const exerciciosFiltrados = exercicios.filter((exercicio) => {

        const textoPesquisa = pesquisa.toLowerCase();

        const nome = exercicio.nome?.toLowerCase() || "";

        const grupoMuscular =
            exercicio.grupo_muscular?.toLowerCase() || "";

        return (
            nome.includes(textoPesquisa) ||
            grupoMuscular.includes(textoPesquisa)
        );

    });


    return (

        <Layout>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>

                    <h1 className="text-4xl font-bold">
                        Exercícios
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Gerencie os exercícios utilizados nos treinos.
                    </p>

                </div>

                <button
                    onClick={() => navigate("/cadastrar-exercicio")}
                    className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                    <Plus size={20} />
                    Novo Exercício
                </button>

            </div>


            <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

                <div className="relative">

                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                        placeholder="Pesquisar por nome ou grupo muscular..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

            </div>


            {carregando ? (

                <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                    <p className="text-gray-500">
                        Carregando exercícios...
                    </p>

                </div>

            ) : exerciciosFiltrados.length === 0 ? (

                <div className="bg-white rounded-2xl shadow-md p-8 text-center">

                    <p className="text-gray-500">
                        Nenhum exercício encontrado.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {exerciciosFiltrados.map((exercicio) => (

                        <ExercicioCard
                            key={exercicio.id}
                            nome={exercicio.nome}
                            grupoMuscular={exercicio.grupo_muscular}
                            descricao={exercicio.descricao}
                            onEditar={() =>
                                navigate(
                                    `/editar-exercicio/${exercicio.id}`
                                )
                            }
                            onExcluir={() =>
                                handleExcluirExercicio(exercicio.id)
                            }
                        />

                    ))}

                </div>

            )}

        </Layout>
    );
}