// Layout padrão do EvolutionFit.
import Layout from "../../components/Layout/Layout";

// Hooks para controlar estados e carregar dados.
import { useEffect, useState } from "react";

// Permite navegar entre as páginas.
import { useNavigate } from "react-router-dom";

// Realiza as requisições HTTP para a API.
import axios from "axios";

// Ícones dos campos e botões.
import {
    ArrowLeft,
    User,
    Calendar,
    Weight,
    Ruler,
    FileText
} from "lucide-react";


// Obtém a data atual no horário local.
// Evita que a conversão para UTC altere o dia apresentado.
function obterDataAtual() {
    const agora = new Date();

    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


// Converte uma entrada para número.
// Aceita vírgula como separador decimal.
// Campo vazio retorna NaN, em vez de virar zero.
function converterNumero(valor) {
    const texto = String(valor).trim();

    if (texto === "") {
        return NaN;
    }

    return Number(texto.replace(",", "."));
}


// Estilos compartilhados pelos campos.
const estiloCampo =
    "w-full min-w-0 rounded-xl border border-gray-300 " +
    "py-3 pr-4 pl-11 focus:ring-2 focus:ring-purple-600 " +
    "focus:outline-none disabled:bg-gray-100";

// Posiciona os ícones dentro dos campos.
const estiloIcone =
    "pointer-events-none absolute top-4 left-4 text-gray-400";


export default function CadastrarAvaliacao() {
    // Permite retornar à listagem de avaliações.
    const navigate = useNavigate();

    // Lista de alunos recebida da API.
    const [alunos, setAlunos] = useState([]);

    // Valores dos campos do formulário.
    const [usuarioId, setUsuarioId] = useState("");
    const [dataAvaliacao, setDataAvaliacao] =
        useState(obterDataAtual);

    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [observacoes, setObservacoes] = useState("");

    // Estados de carregamento, erro e salvamento.
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [salvando, setSalvando] = useState(false);


    // Carrega os alunos quando a página é aberta.
    useEffect(() => {
        // Permite cancelar a consulta se a página for fechada.
        const controller = new AbortController();

        async function carregarAlunos() {
            try {
                const response = await axios.get(
                    "http://localhost:5000/user/list",
                    {
                        signal: controller.signal
                    }
                );

                if (controller.signal.aborted) {
                    return;
                }

                // Confere o formato esperado antes de usar a resposta.
                if (!Array.isArray(response.data)) {
                    throw new Error(
                        "O servidor retornou uma lista de alunos inválida."
                    );
                }

                // Mantém somente as contas de aluno.
                const apenasAlunos = response.data.filter(
                    (usuario) => usuario.tipo_usuario === "aluno"
                );

                setAlunos(apenasAlunos);

            } catch (error) {
                // Cancelar a consulta ao sair da página não é uma falha.
                if (controller.signal.aborted) {
                    return;
                }

                console.error(error);

                const mensagem =
                    error.response?.data?.message ||
                    (
                        error.response
                            ? "Erro ao carregar alunos!"
                            : "Não foi possível carregar os alunos. Confira a conexão com o servidor."
                    );

                setErroCarregamento(mensagem);

            } finally {
                if (!controller.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        carregarAlunos();

        // Executado ao desmontar o componente.
        return () => controller.abort();
    }, []);


    // Converte os valores para validar e mostrar a prévia do IMC.
    const pesoInformado = converterNumero(peso);
    const alturaNumero = converterNumero(altura);

    // O limite corresponde à coluna DECIMAL(6,2) da avaliação.
    const pesoValido =
        Number.isFinite(pesoInformado) &&
        pesoInformado >= 0.01 &&
        pesoInformado <= 9999.99;

    // Usa centímetros inteiros, como no cadastro de alunos.
    const alturaValida =
        Number.isInteger(alturaNumero) &&
        alturaNumero >= 50 &&
        alturaNumero <= 300;

    // Arredonda o peso como o backend faz antes do cálculo.
    const pesoNumero = pesoValido
        ? Number(pesoInformado.toFixed(2))
        : null;

    // A altura é enviada em centímetros.
    // Apenas para calcular o IMC, convertemos para metros.
    const alturaMetros = alturaNumero / 100;

    const imcCalculado =
        pesoValido && alturaValida
            ? Number(
                (
                    pesoNumero /
                    (alturaMetros * alturaMetros)
                ).toFixed(2)
            )
            : null;

    // O resultado precisa caber na coluna DECIMAL(5,2).
    const imcValido =
        imcCalculado !== null &&
        Number.isFinite(imcCalculado) &&
        imcCalculado > 0 &&
        imcCalculado <= 999.99;

    const imcPrevisto = imcValido
        ? imcCalculado.toFixed(2)
        : null;

    // Evita envio quando a lista não está disponível.
    const envioBloqueado =
        carregando ||
        salvando ||
        Boolean(erroCarregamento) ||
        alunos.length === 0;


    // Executada quando o personal envia o formulário.
    async function handleSalvarAvaliacao(e) {
        // Impede o recarregamento padrão da página.
        e.preventDefault();

        if (envioBloqueado) {
            return;
        }

        // Confere se o identificador selecionado é válido.
        const alunoId = Number(usuarioId);

        if (!Number.isSafeInteger(alunoId) || alunoId <= 0) {
            alert("Selecione um aluno válido!");
            return;
        }

        if (!dataAvaliacao) {
            alert("Informe a data da avaliação!");
            return;
        }

        if (!pesoValido) {
            alert("Informe um peso entre 0,01 e 9999,99 kg!");
            return;
        }

        if (!alturaValida) {
            alert(
                "Informe a altura em centímetros inteiros, entre 50 e 300. Exemplo: 175 para 1,75 m."
            );
            return;
        }

        if (!imcValido) {
            alert(
                "O IMC calculado está fora do intervalo permitido. Confira o peso e a altura!"
            );
            return;
        }

        try {
            setSalvando(true);

            // Envia peso em kg e altura em centímetros.
            // O backend calcula novamente o IMC.
            // A prévia da interface não é enviada como valor definitivo.
            const response = await axios.post(
                "http://localhost:5000/avaliacao/create",
                {
                    usuario_id: alunoId,
                    peso: pesoNumero,
                    altura: alturaNumero,
                    data_avaliacao: dataAvaliacao,
                    observacoes: observacoes.trim()
                }
            );

            alert(
                response.data.message ||
                "Avaliação cadastrada com sucesso!"
            );

            navigate("/avaliacoes");

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                (
                    error.response
                        ? "Erro ao cadastrar avaliação!"
                        : "Não foi possível conectar ao servidor."
                )
            );

        } finally {
            setSalvando(false);
        }
    }


    return (
        <Layout>
            {/* Retorna à listagem sem enviar o formulário. */}
            <button
                type="button"
                onClick={() => navigate("/avaliacoes")}
                disabled={salvando}
                className="mb-6 flex cursor-pointer items-center gap-2 text-purple-700 transition hover:text-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ArrowLeft size={20} aria-hidden="true" />
                Voltar para Avaliações
            </button>

            <div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                    Nova Avaliação
                </h1>

                <p className="mt-2 mb-8 text-gray-500">
                    Cadastre uma nova avaliação física.
                </p>

                {/* Mostra a falha de carregamento de forma visível. */}
                {erroCarregamento && (
                    <p
                        role="alert"
                        className="mb-6 text-red-700"
                    >
                        {erroCarregamento}
                    </p>
                )}

                {/* Distingue lista vazia de falha na consulta. */}
                {!carregando &&
                    !erroCarregamento &&
                    alunos.length === 0 && (
                        <p className="mb-6 text-gray-700">
                            Nenhum aluno disponível. Cadastre um aluno
                            antes de registrar uma avaliação.
                        </p>
                    )}

                <form
                    onSubmit={handleSalvarAvaliacao}
                    className="space-y-6 rounded-2xl bg-white p-4 shadow-md sm:p-8"
                >
                    {/* SELEÇÃO DO ALUNO */}
                    <div>
                        {/* htmlFor associa o rótulo ao campo pelo id. */}
                        <label
                            htmlFor="avaliacao-aluno"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Aluno
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                aria-hidden="true"
                                className={estiloIcone}
                            />

                            <select
                                id="avaliacao-aluno"
                                value={usuarioId}
                                onChange={(e) =>
                                    setUsuarioId(e.target.value)
                                }
                                disabled={envioBloqueado}
                                required
                                className={estiloCampo}
                            >
                                <option value="">
                                    {carregando
                                        ? "Carregando alunos..."
                                        : "Selecione um aluno"}
                                </option>

                                {/* Cria uma opção para cada aluno. */}
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

                    {/* DATA DA AVALIAÇÃO */}
                    <div>
                        <label
                            htmlFor="avaliacao-data"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Data da Avaliação
                        </label>

                        <div className="relative">
                            <Calendar
                                size={18}
                                aria-hidden="true"
                                className={estiloIcone}
                            />

                            <input
                                id="avaliacao-data"
                                type="date"
                                min="1000-01-01"
                                max="9999-12-31"
                                value={dataAvaliacao}
                                onChange={(e) =>
                                    setDataAvaliacao(e.target.value)
                                }
                                disabled={salvando}
                                required
                                className={estiloCampo}
                            />
                        </div>
                    </div>

                    {/* Uma coluna no celular e duas em telas maiores. */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* PESO EM QUILOGRAMAS */}
                        <div>
                            <label
                                htmlFor="avaliacao-peso"
                                className="mb-2 block font-medium text-gray-700"
                            >
                                Peso (kg)
                            </label>

                            <div className="relative">
                                <Weight
                                    size={18}
                                    aria-hidden="true"
                                    className={estiloIcone}
                                />

                                <input
                                    id="avaliacao-peso"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max="9999.99"
                                    value={peso}
                                    onChange={(e) =>
                                        setPeso(e.target.value)
                                    }
                                    disabled={salvando}
                                    placeholder="Ex.: 80,50"
                                    aria-describedby="avaliacao-peso-ajuda"
                                    required
                                    className={estiloCampo}
                                />
                            </div>

                            <p
                                id="avaliacao-peso-ajuda"
                                className="mt-2 text-sm text-gray-500"
                            >
                                Informe o peso em kg, com até duas
                                casas decimais.
                            </p>
                        </div>

                        {/* ALTURA EM CENTÍMETROS INTEIROS */}
                        <div>
                            <label
                                htmlFor="avaliacao-altura"
                                className="mb-2 block font-medium text-gray-700"
                            >
                                Altura (cm)
                            </label>

                            <div className="relative">
                                <Ruler
                                    size={18}
                                    aria-hidden="true"
                                    className={estiloIcone}
                                />

                                <input
                                    id="avaliacao-altura"
                                    type="number"
                                    step="1"
                                    min="50"
                                    max="300"
                                    value={altura}
                                    onChange={(e) =>
                                        setAltura(e.target.value)
                                    }
                                    disabled={salvando}
                                    placeholder="Ex.: 175"
                                    aria-describedby="avaliacao-altura-ajuda"
                                    required
                                    className={estiloCampo}
                                />
                            </div>

                            <p
                                id="avaliacao-altura-ajuda"
                                className="mt-2 text-sm text-gray-500"
                            >
                                Use centímetros inteiros: 175 para
                                representar 1,75 m.
                            </p>
                        </div>
                    </div>

                    {/* OBSERVAÇÕES OPCIONAIS */}
                    <div>
                        <label
                            htmlFor="avaliacao-observacoes"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            Observações
                        </label>

                        <div className="relative">
                            <FileText
                                size={18}
                                aria-hidden="true"
                                className={estiloIcone}
                            />

                            <textarea
                                id="avaliacao-observacoes"
                                rows={4}
                                value={observacoes}
                                onChange={(e) =>
                                    setObservacoes(e.target.value)
                                }
                                disabled={salvando}
                                placeholder="Digite observações da avaliação..."
                                className={estiloCampo}
                            />
                        </div>
                    </div>

                    {/* Prévia informativa: o cálculo definitivo é da API. */}
                    <div
                        aria-live="polite"
                        className="rounded-xl border border-purple-100 bg-purple-50 p-4"
                    >
                        <p className="text-sm text-purple-800">
                            O IMC será calculado automaticamente
                            com base no peso e na altura.
                        </p>

                        {imcPrevisto !== null && (
                            <p className="mt-2 text-lg font-bold text-purple-900">
                                IMC previsto: {imcPrevisto}
                            </p>
                        )}

                        {pesoValido &&
                            alturaValida &&
                            !imcValido && (
                                <p className="mt-2 text-sm text-red-700">
                                    Confira as medidas: o IMC está
                                    fora do intervalo permitido.
                                </p>
                            )}
                    </div>

                    {/* Botões empilhados no celular. */}
                    <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/avaliacoes")}
                            disabled={salvando}
                            className="cursor-pointer rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={envioBloqueado}
                            className="cursor-pointer rounded-xl bg-purple-700 px-8 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
                        >
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
