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

    // =========================================
    // FORMATAR DATA
    // =========================================

    function formatarData(data) {

        if (!data) {
            return "";
        }


        const dataFormatada =
            new Date(data);


        if (
            Number.isNaN(
                dataFormatada.getTime()
            )
        ) {
            return "";
        }


        return dataFormatada.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit"
            }
        );

    }


    // =========================================
    // FORMATAR DADOS
    // =========================================

    const dadosFormatados =
        Array.isArray(dados)
            ? dados.map((item) => ({

                ...item,

                carga:
                    Number(item.carga),

                dataFormatada:
                    formatarData(
                        item.data
                    )

            }))
            : [];


    // =========================================
    // SEM HISTÓRICO
    // =========================================

    if (dadosFormatados.length === 0) {

        return (

            <div className="flex h-75 items-center justify-center">

                <p className="text-gray-500">

                    Nenhum histórico de carga disponível.

                </p>

            </div>

        );

    }


    // =========================================
    // GRÁFICO
    // =========================================

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


                <YAxis
                    unit=" kg"
                />


                <Tooltip
                    formatter={(valor) => [
                        `${valor} kg`,
                        "Carga"
                    ]}
                />


                <Line
                    type="monotone"
                    dataKey="carga"
                    name="Carga"
                    stroke="#7C3AED"
                    strokeWidth={3}
                />

            </LineChart>

        </ResponsiveContainer>

    );

}