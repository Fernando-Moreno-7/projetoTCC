import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    ArrowLeft,
    Activity,
    FileText
} from "lucide-react";

export default function CadastrarExercicio() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [grupoMuscular, setGrupoMuscular] = useState("");
    const [descricao, setDescricao] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function handleCadastrarExercicio(e) {

        e.preventDefault();

        if (!nome) {
            alert("Digite o nome do exercício!");
            return;
        }

        if (!grupoMuscular) {
            alert("Informe o grupo muscular!");
            return;
        }

        if (!descricao) {
            alert("Digite a descrição do exercício!");
            return;
        }

        try {

            setSalvando(true);

            const response = await axios.post(
                "http://localhost:5000/exercicio/create",
                {
                    nome,
                    grupo_muscular: grupoMuscular,
                    descricao
                }
            );

            alert(response.data.message);

            navigate("/exercicios");

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar exercício!"
                );

            } else {

                alert("Não foi possível conectar ao servidor.");

            }

        } finally {

            setSalvando(false);

        }
    }

    return (

        <Layout>

            <button
                onClick={() => navigate("/exercicios")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />
                Voltar para Exercícios
            </button>

            <div>

                <div className="mb-8">

                    <h1 className="text-4xl font-bold">
                        Cadastrar Exercício
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Cadastre um novo exercício para utilizar nos treinos.
                    </p>

                </div>

                <form
                    onSubmit={handleCadastrarExercicio}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome do Exercício
                        </label>

                        <div className="relative">

                            <Activity
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: Supino Reto"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Grupo Muscular
                        </label>

                        <select
                            value={grupoMuscular}
                            onChange={(e) => setGrupoMuscular(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >

                            <option value="">
                                Selecione o grupo muscular
                            </option>

                            <option value="Peito">Peito</option>
                            <option value="Costas">Costas</option>
                            <option value="Ombros">Ombros</option>
                            <option value="Biceps">Bíceps</option>
                            <option value="Triceps">Tríceps</option>
                            <option value="Pernas">Pernas</option>
                            <option value="Gluteos">Glúteos</option>
                            <option value="Abdomen">Abdômen</option>
                            <option value="Panturrilha">Panturrilha</option>

                        </select>

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Descrição
                        </label>

                        <div className="relative">

                            <FileText
                                size={18}
                                className="absolute left-4 top-5 text-gray-400"
                            />

                            <textarea
                                rows="5"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Descreva como o exercício deve ser realizado..."
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">

                        <button
                            type="button"
                            onClick={() => navigate("/exercicios")}
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
                                ? "Cadastrando..."
                                : "Cadastrar Exercício"}
                        </button>

                    </div>

                </form>

            </div>

        </Layout>
    );
}