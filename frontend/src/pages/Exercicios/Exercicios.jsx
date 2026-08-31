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

            alert("Erro ao buscar exercícios!");

        } finally {

            setCarregando(false);
        }
    }

    async function excluirExercicio(id) {

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
                        id
                    }
                }
            );

            alert(response.data.message);

            buscarExercicios();

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao excluir exercício!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }
    }

    const exerciciosFiltrados = exercicios.filter((exercicio) => {

        const nome = exercicio.nome?.toLowerCase() || "";
        const grupo = exercicio.grupo_muscular?.toLowerCase() || "";

        const termo = pesquisa.toLowerCase();

        return (
            nome.includes(termo) ||
            grupo.includes(termo)
        );
    });

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">
                            Exercícios
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Gerencie os exercícios cadastrados.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/cadastrar-exercicio")
                        }
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >
                        <Plus size={20} />
                        Novo Exercício
                    </button>

                </div>

                <div className="relative mb-8">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={pesquisa}
                        onChange={(e) =>
                            setPesquisa(e.target.value)
                        }
                        placeholder="Pesquisar por nome ou grupo muscular..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

                {carregando ? (

                    <p className="text-gray-500">
                        Carregando exercícios...
                    </p>

                ) : exerciciosFiltrados.length === 0 ? (

                    <p className="text-gray-500">
                        Nenhum exercício encontrado.
                    </p>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {exerciciosFiltrados.map((exercicio) => (

                            <ExercicioCard
                                key={exercicio.id}
                                nome={exercicio.nome}
                                grupoMuscular={
                                    exercicio.grupo_muscular
                                }
                                descricao={exercicio.descricao}
                                imagem={exercicio.imagem}
                                onEditar={() =>
                                    navigate(
                                        `/editar-exercicio/${exercicio.id}`
                                    )
                                }
                                onExcluir={() =>
                                    excluirExercicio(exercicio.id)
                                }
                            />

                        ))}

                    </div>

                )}

            </div>

        </Layout>

    );
}