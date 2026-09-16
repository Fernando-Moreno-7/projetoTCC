import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import TreinoHoje from "../../components/TreinoHoje/TreinoHoje";
import GraficoEvolucao from "../../components/GraficoEvolucao/GraficoEvolucao";

import { useEffect, useState } from "react";
import axios from "axios";

import {
    Activity,
    Target,
    Dumbbell,
    Trophy
} from "lucide-react";


export default function Dashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const [carregando, setCarregando] =
        useState(true);


    useEffect(() => {

        async function carregarDashboard() {

            try {

                const usuarioId =
                    localStorage.getItem("userId");


                if (!usuarioId) {

                    alert(
                        "Usuário não identificado. Faça login novamente."
                    );

                    return;

                }


                const response =
                    await axios.get(
                        `http://localhost:5000/dashboard/${usuarioId}`
                    );


                setDashboard(
                    response.data
                );


            } catch (error) {

                console.error(error);


                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar dashboard!"
                    );

                } else {

                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }


            } finally {

                setCarregando(false);

            }

        }


        carregarDashboard();

    }, []);


    // =========================================
    // CARREGANDO
    // =========================================

    if (carregando) {

        return (

            <Layout>

                <p className="text-gray-500">

                    Carregando dashboard...

                </p>

            </Layout>

        );

    }


    // =========================================
    // ERRO AO CARREGAR
    // =========================================

    if (!dashboard) {

        return (

            <Layout>

                <p className="text-gray-500">

                    Não foi possível carregar o dashboard.

                </p>

            </Layout>

        );

    }


    // =========================================
    // DADOS
    // =========================================

    const {
        usuario,
        treino_hoje,
        estatisticas,
        evolucao_carga
    } = dashboard;


    const imc =
        usuario?.imc !== null &&
        usuario?.imc !== undefined
            ? Number(
                usuario.imc
            ).toFixed(2)
            : "Não informado";


    const maiorCarga =
        estatisticas?.maior_carga !== null &&
        estatisticas?.maior_carga !== undefined
            ? `${estatisticas.maior_carga} kg`
            : "Sem registro";


    const dadosEvolucao =
        Array.isArray(evolucao_carga)
            ? evolucao_carga
            : [];


    return (

        <Layout>

            <div>


                {/* CABEÇALHO */}

                <h1 className="mb-2 text-4xl font-bold">

                    Dashboard

                </h1>


                <p className="mb-8 text-gray-500">

                    Bem-vindo ao EvolutionFit,{" "}

                    {usuario?.nome || "Aluno"}!

                </p>


                {/* CARDS */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">


                    {/* IMC */}

                    <Card
                        titulo="IMC"
                        valor={imc}
                        icone={
                            <Activity size={28} />
                        }
                        cor="bg-blue-500"
                    />


                    {/* OBJETIVO */}

                    <Card
                        titulo="Objetivo"
                        valor={
                            usuario?.objetivo ||
                            "Não informado"
                        }
                        icone={
                            <Target size={28} />
                        }
                        cor="bg-green-500"
                    />


                    {/* TREINOS CONCLUÍDOS */}

                    <Card
                        titulo="Treinos Concluídos"
                        valor={
                            estatisticas
                                ?.treinos_concluidos ??
                            0
                        }
                        icone={
                            <Dumbbell size={28} />
                        }
                        cor="bg-purple-600"
                    />


                    {/* MAIOR CARGA */}

                    <Card
                        titulo="Maior Carga"
                        valor={maiorCarga}
                        icone={
                            <Trophy size={28} />
                        }
                        cor="bg-orange-500"
                    />


                </div>


                {/* TREINO + GRÁFICO */}

                <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">


                    {/* TREINO DE HOJE */}

                    <TreinoHoje
                        treino={
                            treino_hoje
                        }
                    />


                    {/* EVOLUÇÃO */}

                    <div className="rounded-2xl bg-white p-6 shadow-md">

                        <h2 className="mb-4 text-2xl font-bold">

                            Evolução de Carga

                        </h2>


                        <GraficoEvolucao
                            dados={
                                dadosEvolucao
                            }
                        />


                    </div>


                </div>


            </div>

        </Layout>

    );

}