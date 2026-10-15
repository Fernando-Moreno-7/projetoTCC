
{/* Este componente usa o Layout padrão do EvolutionFit. */}
import Layout from "../../components/Layout/Layout";

// Hooks do React para gerenciar estados e executar efeitos.
import { useEffect, useState } from "react";

// Hook do React Router para navegar entre páginas.
import { useNavigate } from "react-router-dom";

// Biblioteca para realizar requisições HTTP ao backend.
import axios from "axios";

// Ícones utilizados nos campos e botões.
import {
    ArrowLeft,
    User,
    Calendar,
    Weight,
    Ruler,
    FileText
} from "lucide-react";

// Componente responsável pelo cadastro de avaliações físicas.
export default function CadastrarAvaliacao() {

    // Permite redirecionar o usuário para outras páginas.
    const navigate = useNavigate();

    // Obtém a data atual no formato AAAA-MM-DD, usando UTC.
    const hoje = new Date().toISOString().split("T")[0];

    // Armazena a lista de alunos recebida do backend.
    const [alunos, setAlunos] = useState([]);

    // Estados que armazenam os valores digitados no formulário.
    const [usuarioId, setUsuarioId] = useState("");
    const [dataAvaliacao, setDataAvaliacao] = useState(hoje);
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [observacoes, setObservacoes] = useState("");

    // Controla o carregamento da lista de alunos.
    const [carregando, setCarregando] = useState(true);

    // Controla o processo de salvamento da avaliação.
    const [salvando, setSalvando] = useState(false);

    // Executa o carregamento dos alunos quando o componente é montado.
    useEffect(() => {

        // Função assíncrona para consultar os alunos no backend.
        async function carregarAlunos() {

            try {

                // GET busca os usuários cadastrados no sistema.
                const response = await axios.get(
                    "http://localhost:5000/user/list"
                );

                // Verifica se a resposta contém um array.
                // Se não contiver, utiliza um array vazio.
                const usuarios = Array.isArray(response.data)
                    ? response.data
                    : [];

                // Filtra apenas os usuários do tipo "aluno".
                const apenasAlunos = usuarios.filter(
                    (usuario) => usuario.tipo_usuario === "aluno"
                );

                // Atualiza o estado com a lista de alunos filtrada.
                setAlunos(apenasAlunos);

            } catch (error) {

                // Mostra o erro no console para auxiliar na depuração.
                console.error(error);

                // Verifica se o backend retornou uma resposta de erro.
                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Erro ao carregar alunos!"
                    );

                } else {

                    // Exibe esta mensagem quando ocorre uma falha de conexão.
                    alert("Não foi possível conectar ao servidor.");

                }

            } finally {

                // Encerra o carregamento, independentemente do resultado.
                setCarregando(false);

            }

        }

        // Chama a função que busca os alunos.
        carregarAlunos();

    }, []); // Array vazio: efeito executado após a montagem do componente.

    // Função executada quando o formulário é enviado.
    async function handleSalvarAvaliacao(e) {

        // Impede o comportamento padrão de recarregar a página.
        e.preventDefault();

        // Verifica se um aluno foi selecionado.
        if (!usuarioId) {
            alert("Selecione um aluno!");
            return;
        }

        // Verifica se a data foi informada.
        if (!dataAvaliacao) {
            alert("Informe a data da avaliação!");
            return;
        }

        // Verifica se o peso foi preenchido.
        if (!peso) {
            alert("Informe o peso!");
            return;
        }

        // Verifica se a altura foi preenchida.
        if (!altura) {
            alert("Informe a altura!");
            return;
        }

        // Converte os valores digitados para números.
        const pesoNumero = Number(peso);
        const alturaNumero = Number(altura);

        // Valida o peso, impedindo valores inválidos ou não positivos.
        if (Number.isNaN(pesoNumero) || pesoNumero <= 0) {
            alert("Informe um peso válido!");
            return;
        }

        // Valida a altura, impedindo valores inválidos ou não positivos.
        if (Number.isNaN(alturaNumero) || alturaNumero <= 0) {
            alert("Informe uma altura válida!");
            return;
        }

        try {

            // Indica que o salvamento começou.
            // Isso permite desabilitar os campos e botões.
            setSalvando(true);

            // POST envia os dados da avaliação para o backend.
            const response = await axios.post(
                "http://localhost:5000/avaliacao/create",
                {
                    // ID do aluno convertido para número.
                    usuario_id: Number(usuarioId),

                    // Peso e altura já convertidos para números.
                    peso: pesoNumero,
                    altura: alturaNumero,

                    // Data selecionada no formulário.
                    data_avaliacao: dataAvaliacao,

                    // Remove espaços desnecessários no início e no fim.
                    observacoes: observacoes.trim()
                }
            );

            // Exibe a mensagem retornada pelo backend.
            alert(response.data.message);

            // Redireciona para a página de avaliações.
            navigate("/avaliacoes");

        } catch (error) {

            // Registra o erro no console.
            console.error(error);

            // Trata os erros retornados pelo backend.
            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Erro ao cadastrar avaliação!"
                );

            } else {

                // Trata falhas de conexão.
                alert("Não foi possível conectar ao servidor.");

            }

        } finally {

            // Finaliza o estado de salvamento.
            setSalvando(false);

        }

    }

    // Converte os valores atuais dos campos para calcular o IMC.
    const pesoNumero = Number(peso);
    const alturaNumero = Number(altura);

    // Calcula o IMC previsto usando a fórmula:
    // IMC = peso / (altura * altura).
    //
    // O operador && verifica se os valores foram preenchidos
    // e são maiores que zero.
    //
    // O operador ternário ? : decide entre calcular o IMC
    // ou retornar null.
    //
    // toFixed(2) formata o resultado com duas casas decimais.
    const imcPrevisto =
        peso &&
        altura &&
        pesoNumero > 0 &&
        alturaNumero > 0
            ? (
                pesoNumero /
                (alturaNumero * alturaNumero)
            ).toFixed(2)
            : null;

    // Retorna os elementos que serão exibidos na tela.
    return (

        <Layout>

            {/* Botão para voltar à página de avaliações. */}
            <button
                type="button"
                onClick={() => navigate("/avaliacoes")}
                disabled={salvando}
                className="mb-6 flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
            >

                <ArrowLeft size={20} />

                Voltar para Avaliações

            </button>

            <div>

                {/* Título principal da página. */}
                <h1 className="text-4xl font-bold">
                    Nova Avaliação
                </h1>

                {/* Descrição da funcionalidade. */}
                <p className="mt-2 mb-8 text-gray-500">
                    Cadastre uma nova avaliação física.
                </p>

                {/*
                    FORMULÁRIO

                    onSubmit executa a função handleSalvarAvaliacao
                    quando o professor envia o formulário.
                */}
                <form
                    onSubmit={handleSalvarAvaliacao}
                    className="space-y-6 rounded-2xl bg-white p-8 shadow-md"
                >

                    {/* CAMPO DE SELEÇÃO DO ALUNO */}
                    <div>

                        <label className="mb-2 block font-medium text-gray-700">
                            Aluno
                        </label>

                        <div className="relative">

                            {/* Ícone do usuário. */}
                            <User
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />

                            {/*
                                Lista de alunos.

                                value armazena o ID selecionado.
                                onChange atualiza o estado usuarioId.
                                disabled bloqueia o campo durante
                                o carregamento ou salvamento.
                            */}
                            <select
                                value={usuarioId}
                                onChange={(e) =>
                                    setUsuarioId(e.target.value)
                                }
                                disabled={carregando || salvando}
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            >

                                {/* Opção inicial da lista. */}
                                <option value="">
                                    {carregando
                                        ? "Carregando alunos..."
                                        : "Selecione um aluno"}
                                </option>

                                {/*
                                    map percorre o array de alunos
                                    e cria uma opção para cada aluno.

                                    key ajuda o React a identificar
                                    cada elemento da lista.

                                    value contém o ID do aluno.
                                    aluno.nome mostra o nome na tela.
                                */}
                                {alunos.map((aluno) => (

                                    <option
                                        key={aluno.id}
                                        value={aluno.id}
                                    >
                                        {aluno.nome}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                    {/* CAMPO DA DATA DA AVALIAÇÃO */}
                    <div>

                        <label className="mb-2 block font-medium text-gray-700">
                            Data da Avaliação
                        </label>

                        <div className="relative">

                            <Calendar
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />

                            {/*
                                type="date" permite selecionar uma data.
                                value mostra a data armazenada no estado.
                                onChange atualiza a data selecionada.
                            */}
                            <input
                                type="date"
                                value={dataAvaliacao}
                                onChange={(e) =>
                                    setDataAvaliacao(e.target.value)
                                }
                                disabled={salvando}
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            />

                        </div>

                    </div>

                    {/*
                        CAMPOS DE PESO E ALTURA

                        grid-cols-1 utiliza uma coluna.
                        md:grid-cols-2 utiliza duas colunas
                        em telas médias ou maiores.
                    */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* CAMPO DO PESO */}
                        <div>

                            <label className="mb-2 block font-medium text-gray-700">
                                Peso (kg)
                            </label>

                            <div className="relative">

                                <Weight
                                    size={18}
                                    className="absolute top-4 left-4 text-gray-400"
                                />

                                {/*
                                    type="number" recebe números.
                                   
                                    onChange atualiza o estado peso.
                                */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={peso}
                                    onChange={(e) =>
                                        setPeso(e.target.value)
                                    }
                                    disabled={salvando}
                                    placeholder="Ex: 80.50"
                                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                />

                            </div>

                        </div>

                        {/* CAMPO DA ALTURA */}
                        <div>

                            <label className="mb-2 block font-medium text-gray-700">
                                Altura (m)
                            </label>

                            <div className="relative">

                                <Ruler
                                    size={18}
                                    className="absolute top-4 left-4 text-gray-400"
                                />

                                {/*
                                    Recebe a altura em metros.

                                

                                    onChange atualiza o estado altura.
                                */}
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.50"
                                    value={altura}
                                    onChange={(e) =>
                                        setAltura(e.target.value)
                                    }
                                    disabled={salvando}
                                    placeholder="Ex: 1.75"
                                    className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                                />

                            </div>

                        </div>

                    </div>

                    {/* CAMPO DE OBSERVAÇÕES */}
                    <div>

                        <label className="mb-2 block font-medium text-gray-700">
                            Observações
                        </label>

                        <div className="relative">

                            <FileText
                                size={18}
                                className="absolute top-4 left-4 text-gray-400"
                            />

                            {/*
                                textarea permite digitar textos maiores.

                                value armazena as observações.
                                onChange atualiza esse estado.
                            */}
                            <textarea
                                rows="4"
                                value={observacoes}
                                onChange={(e) =>
                                    setObservacoes(e.target.value)
                                }
                                disabled={salvando}
                                placeholder="Digite observações da avaliação..."
                                className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:bg-gray-100"
                            />

                        </div>

                    </div>

                    {/* ÁREA QUE EXIBE O IMC PREVISTO */}
                    <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">

                        <p className="text-sm text-purple-800">
                            O IMC será calculado automaticamente com base no peso e na altura.
                        </p>

                        {/*
                            Renderização condicional.

                            O && permite mostrar o resultado
                            somente quando imcPrevisto existe.
                        */}
                        {imcPrevisto && (

                            <p className="mt-2 text-lg font-bold text-purple-900">
                                IMC previsto:{" "}
                                {imcPrevisto}
                            </p>

                        )}

                    </div>

                    {/* BOTÕES DE CANCELAR E SALVAR */}
                    <div className="flex justify-end gap-4 border-t pt-8">

                        {/*
                            Botão Cancelar.

                            type="button" evita enviar o formulário.
                            navigate retorna à página de avaliações.
                        */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/avaliacoes")
                            }
                            disabled={salvando}
                            className="cursor-pointer rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            Cancelar

                        </button>

                        {/*
                            Botão Salvar Avaliação.

                            type="submit" envia o formulário.

                            disabled={salvando || carregando}
                            desabilita o botão durante o
                            carregamento ou salvamento.
                        */}
                        <button
                            type="submit"
                            disabled={salvando || carregando}
                            className="cursor-pointer rounded-xl bg-purple-700 px-8 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
                        >

                            {/*
                                Operador ternário.

                                Se salvando for true:
                                mostra "Salvando...".

                                Caso contrário:
                                mostra "Salvar Avaliação".
                            */}
                            {salvando
                                ? "Salvando..."
                                : "Salvar Avaliação"}

                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );

}
