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


                setDashboard(response.data);

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


    if (carregando) {

        return (

            <Layout>

                <p className="text-gray-500">

                    Carregando dashboard...

                </p>

            </Layout>

        );

    }


    if (!dashboard) {

        return (

            <Layout>

                <p className="text-gray-500">

                    Não foi possível carregar o dashboard.

                </p>

            </Layout>

        );

    }


    const {
        usuario,
        treino_hoje,
        estatisticas,
        evolucao_carga
    } = dashboard;


    return (

        <Layout>

            <div>

                <h1 className="text-4xl font-bold mb-2">

                    Dashboard

                </h1>


                <p className="text-gray-500 mb-8">

                    Bem-vindo ao EvolutionFit,{" "}
                    {usuario?.nome}!

                </p>


                {/* CARDS */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">


                    <Card
                        titulo="IMC"
                        valor={
                            usuario?.imc
                                ? usuario.imc
                                : "Não informado"
                        }
                        icone={
                            <Activity size={28} />
                        }
                        cor="bg-blue-500"
                    />


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


                    <Card
                        titulo="Maior Carga"
                        valor={
                            estatisticas?.maior_carga
                                ? `${estatisticas.maior_carga} kg`
                                : "Sem registro"
                        }
                        icone={
                            <Trophy size={28} />
                        }
                        cor="bg-orange-500"
                    />


                </div>


                {/* TREINO + GRÁFICO */}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">


                    <TreinoHoje
                        treino={treino_hoje}
                    />


                    <div className="bg-white rounded-2xl shadow-md p-6">

                        <h2 className="text-2xl font-bold mb-4">

                            Evolução de Carga

                        </h2>


                        <GraficoEvolucao
                            dados={
                                evolucao_carga || []
                            }
                        />


                    </div>


                </div>

            </div>

        </Layout>

    );

}