import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";
import AlunoCard from "../../components/AlunoCard/AlunoCard";

import {
    UserPlus,
    Search
} from "lucide-react";

export default function Alunos() {

    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        buscarAlunos();
    }, []);

    async function buscarAlunos() {

        try {

            setCarregando(true);

            const response = await axios.get(
                "http://localhost:5000/user/list"
            );

            setAlunos(response.data);

        } catch (error) {

            console.error(error);

            alert("Erro ao buscar alunos!");

        } finally {

            setCarregando(false);

        }
    }

    async function excluirAluno(idUsuario) {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este aluno?"
        );

        if (!confirmar) {
            return;
        }

        try {

            const response = await axios.delete(
                "http://localhost:5000/user/delete",
                {
                    data: {
                        idUsuario
                    }
                }
            );

            alert(response.data.message);

            buscarAlunos();

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao excluir aluno!"
                );

            } else {

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }
    }

    const alunosFiltrados = alunos.filter((aluno) =>
        aluno.nome
            .toLowerCase()
            .includes(pesquisa.toLowerCase())
    );

    return (

        <Layout>

            <div>

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1 className="text-4xl font-bold">
                            Alunos
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Gerencie todos os alunos cadastrados.
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/cadastrar-aluno")}
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >
                        <UserPlus size={20} />

                        Novo Aluno
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
                        onChange={(e) => setPesquisa(e.target.value)}
                        placeholder="Pesquisar aluno..."
                        className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

                {carregando ? (

                    <p className="text-gray-500">
                        Carregando alunos...
                    </p>

                ) : alunosFiltrados.length === 0 ? (

                    <p className="text-gray-500">
                        Nenhum aluno encontrado.
                    </p>

                ) : (

                    <div className="space-y-5">

                        {alunosFiltrados.map((aluno) => (

                            <AlunoCard
                                key={aluno.id}
                                nome={aluno.nome}
                                email={aluno.email}
                                telefone="Não informado"
                                status="Ativo"
                                onEditar={() =>
                                    navigate(`/editar-aluno/${aluno.id}`)
                                }
                                onExcluir={() =>
                                    excluirAluno(aluno.id)
                                }
                            />

                        ))}

                    </div>

                )}

            </div>

        </Layout>

    );

}