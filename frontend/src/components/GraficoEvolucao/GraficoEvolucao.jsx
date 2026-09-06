import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


export default function GraficoEvolucao({
    dados = []
}) {

    function formatarData(data) {

        if (!data) {
            return "";
        }

        const dataFormatada = new Date(data);

        return dataFormatada.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit"
            }
        );

    }


    const dadosFormatados = dados.map((item) => ({

        ...item,

        dataFormatada: formatarData(item.data)

    }));


    if (dadosFormatados.length === 0) {

        return (

            <div className="h-75 flex items-center justify-center">

                <p className="text-gray-500">

                    Nenhum histórico de carga disponível.

                </p>

            </div>

        );

    }


    return (

        <ResponsiveContainer
            width="100%"
            height={300}
        >

            <LineChart
                data={dadosFormatados}
            >

                <CartesianGrid
                    strokeDasharray="3 3"
                />

                <XAxis
                    dataKey="dataFormatada"
                />

                <YAxis />

                <Tooltip
                    formatter={(valor) => [
                        `${valor} kg`,
                        "Carga"
                    ]}
                />

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