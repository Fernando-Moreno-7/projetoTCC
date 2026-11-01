
import {
    Dumbbell, // Ícone de musculação
    Pencil,   // Ícone de edição
    Trash2    // Ícone de exclusão
} from "lucide-react";

// Componente responsável por apresentar um card de treino.
// Recebe informações e funções do componente pai através de props.
export default function TreinoCard({
    nome,
    descricao,
    exercicios = [], // Array vazio como valor padrão
    onEditar,
    onExcluir
}) {

    return (

        // Container principal do card.
        // Tailwind CSS define fundo, bordas, sombra,
        // espaçamento e animação ao passar o mouse.
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">

            {/* Organiza as informações e os botões lado a lado */}
            <div className="flex justify-between items-start gap-4">

                {/* Área das informações do treino */}
                <div className="flex-1">

                    {/* Ícone e nome do treino */}
                    <div className="flex items-center gap-3">

                        <Dumbbell
                            size={30}
                            className="text-purple-700"
                        />

                        {/* Nome recebido através das props */}
                        <h2 className="text-2xl font-bold">
                            {nome}
                        </h2>

                    </div>

                    {/* Descrição do treino */}
                    <p className="text-gray-500 mt-2">
                        {descricao}
                    </p>

                    {/* Quantidade de exercícios cadastrados */}
                    <div className="mt-4">

                        <p className="text-sm font-semibold text-gray-600">

                            {/* length retorna a quantidade de itens */}
                            {exercicios.length}{" "}

                            {/* Operador ternário:
                                singular quando existe um exercício,
                                plural nos demais casos */}
                            {exercicios.length === 1
                                ? "exercício"
                                : "exercícios"
                            }

                        </p>

                    </div>

                    {/* Só apresenta a lista quando existem exercícios */}
                    {exercicios.length > 0 && (

                        <div className="mt-4 space-y-3">

                            {/* map percorre o array de exercícios */}
                            {exercicios.map((item) => (

                                <div
                                    // key ajuda o React a identificar
                                    // cada elemento da lista
                                    key={item.id}
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                                >

                                    <div className="flex justify-between items-center gap-4">

                                        <div>

                                            {/* Optional chaining evita erro
                                                caso item.exercicio seja
                                                null ou undefined.

                                                || apresenta texto alternativo
                                                quando o valor é falsy. */}
                                            <p className="font-semibold text-gray-800">
                                                {item.exercicio?.nome || "Exercício"}
                                            </p>

                                            {/* Grupo muscular do exercício */}
                                            <p className="text-sm text-gray-500">
                                                {item.exercicio?.grupo_muscular || "Grupo muscular não informado"}
                                            </p>

                                        </div>

                                        {/* Apresenta séries e repetições.
                                            whitespace-nowrap evita
                                            quebra de linha no texto. */}
                                        <div className="text-sm text-gray-600 whitespace-nowrap">

                                            <span className="font-semibold">
                                                {item.series}
                                            </span>{" "}
                                            séries x{" "}
                                            <span className="font-semibold">
                                                {item.repeticoes}
                                            </span>{" "}
                                            repetições

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

                {/* Botões de editar e excluir */}
                <div className="flex gap-2">

                    {/* onClick executa a função onEditar
                        recebida do componente pai */}
                    <button
                        onClick={onEditar}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                    >
                        <Pencil size={18} />
                    </button>

                    {/* onClick executa a função onExcluir.
                        O componente não exclui diretamente
                        os dados do banco MySQL. */}
                    <button
                        onClick={onExcluir}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                    >
                        <Trash2 size={18} />
                    </button>

                </div>

            </div>

        </div>

    );
}
