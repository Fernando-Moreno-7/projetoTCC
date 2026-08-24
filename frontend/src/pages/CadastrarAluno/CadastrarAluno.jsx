import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "../../components/Layout/Layout";

import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    Calendar,
    Ruler,
    Weight,
    Target
} from "lucide-react";

export default function CadastrarAluno() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [idade, setIdade] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleCadastrarAluno(e) {

        e.preventDefault();

        if (!nome || !email || !senha || !confirmarSenha) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        try {

            setCarregando(true);

            const response = await axios.post(
                "http://localhost:5000/user/register",
                {
                    nome,
                    email,
                    senha,
                    confSenha: confirmarSenha,
                    idade: idade ? Number(idade) : null,
                    altura: altura ? Number(altura) : null,
                    peso: peso ? Number(peso) : null,
                    objetivo: objetivo || null
                }
            );

            alert(response.data.message);

            navigate("/alunos");

        } catch (error) {

            console.error(error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar aluno!"
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
                onClick={() => navigate("/alunos")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} />

                <span>Voltar para Alunos</span>
            </button>

            <div>

                <h1 className="text-4xl font-bold">
                    Cadastrar Aluno
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Cadastre um novo aluno no EvolutionFit.
                </p>

                <form
                    onSubmit={handleCadastrarAluno}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Nome Completo
                        </label>

                        <div className="relative">

                            <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite o nome do aluno"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            E-mail
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite o e-mail"
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-6">

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">
                                Senha
                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Digite uma senha"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">
                                Confirmar Senha
                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="password"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    placeholder="Digite a senha novamente"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-3 gap-6">

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">
                                Idade
                            </label>

                            <div className="relative">

                                <Calendar
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="number"
                                    value={idade}
                                    onChange={(e) => setIdade(e.target.value)}
                                    placeholder="Ex.: 23"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">
                                Altura (cm)
                            </label>

                            <div className="relative">

                                <Ruler
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="number"
                                    value={altura}
                                    onChange={(e) => setAltura(e.target.value)}
                                    placeholder="Ex.: 175"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="block text-gray-700 font-medium mb-2">
                                Peso (kg)
                            </label>

                            <div className="relative">

                                <Weight
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="number"
                                    step="0.1"
                                    value={peso}
                                    onChange={(e) => setPeso(e.target.value)}
                                    placeholder="Ex.: 80"
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                        </div>

                    </div>

                    <div>

                        <label className="block text-gray-700 font-medium mb-2">
                            Objetivo
                        </label>

                        <div className="relative">

                            <Target
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <select
                                value={objetivo}
                                onChange={(e) => setObjetivo(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                                <option value="">
                                    Selecione o objetivo
                                </option>

                                <option value="Hipertrofia">
                                    Hipertrofia
                                </option>

                                <option value="Emagrecimento">
                                    Emagrecimento
                                </option>

                                <option value="Condicionamento">
                                    Condicionamento
                                </option>

                                <option value="Definição">
                                    Definição
                                </option>
                            </select>

                        </div>

                    </div>

                    <div className="flex justify-end gap-4 pt-8 border-t">

                        <button
                            type="button"
                            onClick={() => navigate("/alunos")}
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
                                ? "Cadastrando..."
                                : "Salvar Aluno"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );
}