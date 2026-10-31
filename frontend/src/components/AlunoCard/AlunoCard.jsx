
import {
    User,
    Mail,
    Phone,
    Pencil,
    Trash2
} from "lucide-react";

// Componente reutilizável para exibir
// as informações de um aluno.
//
// Recebe props com os dados do aluno
// e funções para editar e excluir.
export default function AlunoCard({
    nome,
    email,
    telefone,
    status,
    onEditar,
    onExcluir
}) {

    return (

        // Container principal do cartão.
        // bg-white: fundo branco.
        // rounded-2xl: bordas arredondadas.
        // shadow-md: sombra.
        // p-6: espaçamento interno.
        // flex: organiza os elementos com Flexbox.
        // justify-between: separa os dados dos botões.
        // items-center: alinha verticalmente.
        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

            {/* ÁREA COM OS DADOS DO ALUNO */}

            <div>

                {/* Nome, status e ícone do aluno. */}
                <div className="flex items-center gap-3 mb-3">

                    {/* Fundo circular do ícone. */}
                    <div className="bg-purple-100 p-3 rounded-full">

                        {/* Ícone de usuário.
                            size define o tamanho.
                            className define a cor. */}
                        <User
                            size={22}
                            className="text-purple-700"
                        />

                    </div>

                    <div>

                        {/* Nome recebido pelas props.
                            As chaves permitem inserir
                            expressões JavaScript no JSX. */}
                        <h2 className="text-xl font-bold">
                            {nome}
                        </h2>

                        {/* Exibe o status do aluno.
                            A cor verde é definida
                            pelo Tailwind CSS. */}
                        <span className="text-green-600 font-medium">
                            {status}
                        </span>

                    </div>

                </div>

                {/* E-MAIL DO ALUNO */}

                <p className="flex items-center gap-2 text-gray-600">

                    {/* Ícone de e-mail. */}
                    <Mail size={16} />

                    {/* E-mail recebido pelas props. */}
                    {email}

                </p>

                {/* TELEFONE DO ALUNO */}

                <p className="flex items-center gap-2 text-gray-600 mt-2">

                    {/* Ícone de telefone. */}
                    <Phone size={16} />

                    {/* Telefone recebido pelas props. */}
                    {telefone}

                </p>

            </div>

            {/* ÁREA DOS BOTÕES DE AÇÃO */}

            <div className="flex gap-3">

                {/* BOTÃO EDITAR */}

                <button
                    // Executa a função onEditar
                    // recebida do componente pai.
                    onClick={onEditar}

                    // Estilização azul do botão.
                    // hover altera a cor ao passar o mouse.
                    // transition suaviza a mudança.
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition"
                >

                    {/* Ícone de edição. */}
                    <Pencil size={18} />

                </button>

                {/* BOTÃO EXCLUIR */}

                <button
                    // Executa a função onExcluir
                    // recebida do componente pai.
                    onClick={onExcluir}

                    // Estilização vermelha do botão.
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition"
                >

                    {/* Ícone de exclusão. */}
                    <Trash2 size={18} />

                </button>

            </div>

        </div>

    );

}
