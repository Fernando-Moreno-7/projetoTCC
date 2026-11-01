
/*
 * Componente ExercicioItem
 *
 * Responsável por apresentar os campos
 * de preenchimento de um exercício.
 *
 * Possui campos para:
 * - Nome do exercício.
 * - Quantidade de séries.
 * - Quantidade de repetições.
 *
 * Recebe a prop numero para identificar
 * cada exercício apresentado na interface.
 */

// Importa o ícone de lixeira da biblioteca Lucide React.
import { Trash2 } from "lucide-react";

// Exporta o componente para permitir sua
// utilização em outros arquivos do EvolutionFit.
//
// A prop numero identifica o exercício.
export default function ExercicioItem({ numero }) {

    // Retorna a estrutura visual do componente.
    return (

        // Container principal.
        //
        // border: adiciona uma borda.
        // border-gray-200: define a cor da borda.
        // rounded-xl: arredonda os cantos.
        // p-5: adiciona espaçamento interno.
        <div className="border border-gray-200 rounded-xl p-5">

            {/* CABEÇALHO DO EXERCÍCIO */}

            {/* flex: organiza os elementos com Flexbox.
                justify-between: separa título e botão.
                items-center: centraliza verticalmente.
                mb-4: adiciona margem inferior. */}
            <div className="flex justify-between items-center mb-4">

                {/* Exibe o número do exercício.
                    font-semibold: texto seminegrito.
                    text-lg: aumenta o tamanho da fonte.

                    As chaves permitem inserir
                    o valor da prop no JSX. */}
                <h3 className="font-semibold text-lg">

                    Exercício {numero}

                </h3>

                {/* BOTÃO COM ÍCONE DE EXCLUSÃO */}

                {/* Este botão possui apenas a parte visual.
                    Ainda não existe uma função onClick
                    associada à exclusão do exercício. */}
                <button
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                >

                    {/* Ícone de lixeira.
                        size define o tamanho do ícone. */}
                    <Trash2 size={18} />

                </button>

            </div>

            {/* ÁREA DOS CAMPOS DO EXERCÍCIO */}

            {/* grid: ativa o CSS Grid.
                grid-cols-3: cria três colunas.
                gap-4: adiciona espaço entre os campos. */}
            <div className="grid grid-cols-3 gap-4">

                {/* CAMPO NOME DO EXERCÍCIO */}

                <input
                    // Permite digitar texto.
                    type="text"

                    // Texto de orientação do campo.
                    placeholder="Nome do exercício"

                    // Estilização com Tailwind CSS.
                    className="border border-gray-300 rounded-lg p-3"
                />

                {/* CAMPO QUANTIDADE DE SÉRIES */}

                <input
                    // Campo para valores numéricos.
                    type="number"

                    // Orienta o usuário sobre o preenchimento.
                    placeholder="Séries"

                    // Define borda, cantos e espaçamento.
                    className="border border-gray-300 rounded-lg p-3"
                />

                {/* CAMPO QUANTIDADE DE REPETIÇÕES */}

                <input
                    // Campo para valores numéricos.
                    type="number"

                    // Texto de orientação.
                    placeholder="Repetições"

                    // Estilização do campo.
                    className="border border-gray-300 rounded-lg p-3"
                />

            </div>

        </div>

    );

}
