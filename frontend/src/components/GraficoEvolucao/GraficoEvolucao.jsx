import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
const dados = [

    { mes: "Jan", carga: 60 },

    { mes: "Fev", carga: 65 },

    { mes: "Mar", carga: 70 },

    { mes: "Abr", carga: 75 },

    { mes: "Mai", carga: 82 },

    { mes: "Jun", carga: 90 }

];
export default function GraficoEvolucao() {

    return (

        <ResponsiveContainer
            width="100%"
            height={300}
        >

            <LineChart
                data={dados}
            >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="mes" />

                <YAxis />

                <Tooltip />

                <Line
                    type="monotone"
                    dataKey="carga"
                    stroke="#7C3AED"
                    strokeWidth={3}
                />

            </LineChart>

        </ResponsiveContainer>

    );

}