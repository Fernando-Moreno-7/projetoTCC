
/*
 * Componente GraficoEvolucao
 *
 * Responsável por apresentar a evolução
 * das cargas utilizadas nos exercícios.
 *
 * Utiliza a biblioteca Recharts para
 * construir um gráfico de linhas.
 *
 * Recebe a prop dados, que contém
 * os registros do histórico de cargas.
 */

// Importa os componentes da biblioteca Recharts.
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


// Exporta o componente para utilização
// em outras partes do EvolutionFit.
//
// dados = [] define um array vazio como padrão,
// caso a prop não seja informada.
export default function GraficoEvolucao({
    dados = []
}) {

    // =========================================
    // FORMATAR DATA
    // =========================================

    // Função responsável por formatar as datas
    // para apresentação no gráfico.
    function formatarData(data) {

        // Verifica se a data está ausente ou vazia.
        // Caso esteja, retorna uma string vazia.
        if (!data) {
            return "";
        }

        // Converte o valor recebido em
        // um objeto Date do JavaScript.
        const dataFormatada =
            new Date(data);

        // Verifica se a data é inválida.
        //
        // getTime() retorna o tempo em milissegundos.
        // Quando a data é inválida, retorna NaN.
        //
        // Number.isNaN() identifica esse resultado.
        if (
            Number.isNaN(
                dataFormatada.getTime()
            )
        ) {
            return "";
        }

        // Formata a data no padrão brasileiro.
        //
        // pt-BR: formato brasileiro.
        // day: "2-digit": dia com dois dígitos.
        // month: "2-digit": mês com dois dígitos.
        //
        // Exemplo: 15/10.
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

    // Prepara os dados recebidos para
    // utilização no gráfico.
    const dadosFormatados =

        // Verifica se dados é um array.
        // Isso evita tentar utilizar map()
        // em um valor que não seja uma lista.
        Array.isArray(dados)

            // Percorre os registros e cria
            // um novo array com os dados formatados.
            ? dados.map((item) => ({

                // Mantém as propriedades existentes
                // do registro original.
                ...item,

                // Converte a carga para número.
                // Exemplo: "50" passa a ser 50.
                carga:
                    Number(item.carga),

                // Cria uma propriedade com
                // a data formatada.
                dataFormatada:
                    formatarData(
                        item.data
                    )

            }))

            // Caso dados não seja um array,
            // utiliza um array vazio.
            : [];


    // =========================================
    // SEM HISTÓRICO
    // =========================================

    // Verifica se o array está vazio.
    //
    // length representa a quantidade
    // de elementos existentes no array.
    if (dadosFormatados.length === 0) {

        // Caso não existam registros,
        // apresenta uma mensagem ao usuário.
        return (

            // flex: utiliza Flexbox.
            // h-75: define a altura do container.
            // items-center: alinha verticalmente.
            // justify-center: centraliza horizontalmente.
            <div className="flex h-75 items-center justify-center">

                <p className="text-gray-500">

                    Nenhum histórico de carga disponível.

                </p>

            </div>

        );

    }


    // =========================================
    // GRÁFICO DE EVOLUÇÃO
    // =========================================

    // Retorna o gráfico quando existem registros.
    return (

        // Faz o gráfico ocupar toda a largura
        // disponível e define altura de 300 pixels.
        <ResponsiveContainer
            width="100%"
            height={300}
        >

            {/* Componente principal do gráfico.
                Recebe o array de dados formatados. */}
            <LineChart
                data={dadosFormatados}
            >

                {/* Adiciona linhas de grade
                    para facilitar a leitura.

                    strokeDasharray="3 3" define
                    o padrão tracejado da grade. */}
                <CartesianGrid
                    strokeDasharray="3 3"
                />


                {/* EIXO HORIZONTAL (X) */}

                {/* Apresenta as datas formatadas
                    dos registros de carga. */}
                <XAxis
                    dataKey="dataFormatada"
                />


                {/* EIXO VERTICAL (Y) */}

                {/* Apresenta a escala das cargas.
                    unit=" kg" adiciona a unidade
                    de quilogramas aos valores. */}
                <YAxis
                    unit=" kg"
                />


                {/* TOOLTIP */}

                {/* Apresenta informações detalhadas
                    ao passar o mouse sobre o gráfico.

                    formatter personaliza a exibição
                    do valor e do nome da informação.

                    Exemplo: Carga: 50 kg. */}
                <Tooltip
                    formatter={(valor) => [
                        `${valor} kg`,
                        "Carga"
                    ]}
                />


                {/* LINHA DO GRÁFICO */}

                {/* type="monotone": utiliza uma curva suave.

                    dataKey="carga": identifica os
                    valores utilizados na linha.

                    name="Carga": nome da série.

                    stroke: define a cor roxa.

                    strokeWidth: define a espessura
                    da linha. */}
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
