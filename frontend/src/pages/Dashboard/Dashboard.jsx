import Layout from "../../components/Layout/Layout";
import Card from "../../components/Card/Card";
import TreinoHoje from "../../components/TreinoHoje/TreinoHoje";

import {
    Activity,
    Target,
    Dumbbell,
    Trophy
} from "lucide-react";

export default function Dashboard() {

    return (

        <Layout>

           <div>

    <h1 className="text-4xl font-bold mb-2">
        Dashboard
    </h1>

    <p className="text-gray-500 mb-8">
        Bem-vindo ao EvolutionFit!
    </p>

    <div className="grid grid-cols-4 gap-6">

        <Card
            titulo="IMC"
            valor="26"
            icone={<Activity size={28} />}
            cor="bg-blue-500"
        />

        <Card
            titulo="Objetivo"
            valor="Hipertrofia"
            icone={<Target size={28} />}
            cor="bg-green-500"
        />

        <Card
            titulo="Treinos"
            valor="12"
            icone={<Dumbbell size={28} />}
            cor="bg-purple-600"
        />

        <Card
            titulo="Maior Carga"
            valor="90 kg"
            icone={<Trophy size={28} />}
            cor="bg-orange-500"
        />

    </div>
    <div className="grid grid-cols-2 gap-6 mt-8">

    <TreinoHoje />

    <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-2xl font-bold mb-4">

            Evolução de Carga

        </h2>

        <div className="h-72 flex items-center justify-center text-gray-400">

            Gráfico em construção...

        </div>

    </div>

</div>


</div>

        </Layout>

    );

}