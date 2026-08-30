import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";
import TreinoCard from "../../components/TreinoCard/TreinoCard";

import {
    Plus,
    Search
} from "lucide-react";

export default function Treinos() {

    const navigate = useNavigate();

    const [treinos, setTreinos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        buscarTreinos();
    }, []);

    async function buscarTreinos() {

        try {

            setCarregando(true);

            const response = await axios.get(
                "http://localhost:5000/treino/list"
            );

            setTreinos(response.data);

        } catch (error) {

            console.error(error);

            alert("Erro ao buscar treinos!");

        } finally {

            setCarregando(false);

        }
    }

    async function excluirTreino(idTreino) {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este treino?"
        );

        if (!confirmar) {
            return;
        }

        try {

            const response = await axios.delete(
                "http://localhost:5000/treino/delete",
                {
                    data: {
                        idTreino
                    }
                }
            );

            alert(response.data.message);

            buscarTreinos();

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao excluir treino!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }
    }

    const treinosFiltrados = treinos.filter((treino) =>
        treino.nome
            .toLowerCase()
            .includes(pesquisa.toLowerCase())
    );

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">
                            Treinos
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Gerencie os treinos cadastrados.
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/cadastrar-treino")}
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >
                        <Plus size={20} />

                        Novo Treino
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
                        placeholder="Pesquisar treino..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

                {carregando ? (

                    <p className="text-gray-500">
                        Carregando treinos...
                    </p>

                ) : treinosFiltrados.length === 0 ? (

                    <p className="text-gray-500">
                        Nenhum treino encontrado.
                    </p>

                ) : (

                    <div className="space-y-5">

                        {treinosFiltrados.map((treino) => (

                            <TreinoCard
                                key={treino.id}
                                nome={treino.nome}
                                descricao={treino.descricao}

                                exercicios={
                                    treino.treino_exercicios || []
                                }

                                onEditar={() =>
                                    navigate(
                                        `/editar-treino/${treino.id}`
                                    )
                                }

                                onExcluir={() =>
                                    excluirTreino(treino.id)
                                }
                            />

                        ))}

                    </div>

                )}

            </div>

        </Layout>

    );
}