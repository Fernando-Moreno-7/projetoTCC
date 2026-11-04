// useState permite armazenar valores que podem mudar na tela.
// Quando um estado muda, o React atualiza a interface.
import { useState } from "react";

// Permite navegar entre as páginas sem recarregar o aplicativo.
import { useNavigate } from "react-router-dom";

// Biblioteca utilizada para fazer requisições HTTP ao backend.
import axios from "axios";

// Layout compartilhado pelas páginas do sistema.
import Layout from "../../components/Layout/Layout";

// Ícones utilizados nos campos e nos botões.
import {
    ArrowLeft,
    User,
    Mail,
    Lock,
    Calendar,
    Ruler,
    Weight,
    Target,
    Phone,
    Activity
} from "lucide-react";

// Classes compartilhadas pelos inputs e selects.
// Evitam repetir a mesma estilização em todos os campos.
const estiloCampo =
    "w-full min-w-0 border border-gray-300 rounded-xl py-3 pl-11 pr-4 " +
    "focus:outline-none focus:ring-2 focus:ring-purple-600";

// Posiciona os ícones dentro dos campos.
const estiloIcone =
    "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400";

// =========================================
// COMPONENTE REUTILIZÁVEL DE CAMPO
// =========================================

// Recebe informações pelas props:
// id: identificador do campo.
// titulo: texto apresentado no rótulo.
// icone: componente do ícone, renomeado para Icone.
// ajuda: orientação opcional abaixo do campo.
// children: input ou select colocado dentro de Campo.
function Campo({ id, titulo, icone: Icone, ajuda, children }) {
    return (
        <div className="min-w-0">
            {/* htmlFor associa o rótulo ao input com o mesmo id. */}
            <label
                htmlFor={id}
                className="block text-gray-700 font-medium mb-2"
            >
                {titulo}
            </label>

            {/* relative serve de referência para posicionar o ícone. */}
            <div className="relative">
                {/* O ícone é decorativo e não precisa ser lido. */}
                <Icone
                    size={18}
                    className={estiloIcone}
                    aria-hidden="true"
                />

                {/* Exibe o input ou select recebido pelo componente. */}
                {children}
            </div>

            {/* Só apresenta a orientação quando ajuda foi informada. */}
            {ajuda && (
                <p
                    id={`${id}-ajuda`}
                    className="text-sm text-gray-500 mt-2"
                >
                    {ajuda}
                </p>
            )}
        </div>
    );
}

// =========================================
// COMPONENTE DE CADASTRO DE ALUNO
// =========================================

export default function CadastrarAluno() {
    // Função utilizada para mudar de página.
    const navigate = useNavigate();

    // Cada estado guarda o valor de um campo do formulário.
    // A função set correspondente atualiza esse valor.
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [idade, setIdade] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [telefone, setTelefone] = useState("");

    // Todo novo formulário começa com o status Ativo.
    const [status, setStatus] = useState("Ativo");

    // Indica se o cadastro está sendo enviado ao servidor.
    const [carregando, setCarregando] = useState(false);

    // =========================================
    // VALIDAR E ENVIAR O CADASTRO
    // =========================================

    async function handleCadastrarAluno(e) {
        // Impede o recarregamento padrão ao enviar o formulário.
        e.preventDefault();

        // Evita um novo envio enquanto a requisição está em andamento.
        if (carregando) return;

        // trim remove espaços do início e do fim do texto.
        // As senhas são verificadas sem remover seus espaços.
        if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        // Interrompe o cadastro se as senhas forem diferentes.
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        // Os inputs fornecem seus valores como texto.
        // Number converte os campos preenchidos em números.
        // Campos opcionais vazios são enviados como null.
        const alturaNumero = altura === "" ? null : Number(altura);
        const pesoNumero = peso === "" ? null : Number(peso);
        const idadeNumero = idade === "" ? null : Number(idade);

        // A altura do cadastro é informada em centímetros inteiros.
        // Exemplo: 175 corresponde a 1,75 metro.
        // O intervalo segue a regra definida no backend.
        if (
            alturaNumero !== null &&
            (
                !Number.isInteger(alturaNumero) ||
                alturaNumero < 50 ||
                alturaNumero > 300
            )
        ) {
            alert(
                "Informe a altura em centímetros inteiros, entre 50 e 300. " +
                "Exemplo: 175 para 1,75 m."
            );
            return;
        }

        // Number.isFinite rejeita valores como NaN e Infinity.
        // O peso deve ser positivo e caber em DECIMAL(10,2).
        if (
            pesoNumero !== null &&
            (
                !Number.isFinite(pesoNumero) ||
                pesoNumero < 0.01 ||
                pesoNumero > 99999999.99
            )
        ) {
            alert("Informe um peso válido em quilogramas, maior que zero!");
            return;
        }

        // A idade deve ser um número inteiro seguro e não negativo.
        if (
            idadeNumero !== null &&
            (
                !Number.isSafeInteger(idadeNumero) ||
                idadeNumero < 0
            )
        ) {
            alert("Informe a idade em anos inteiros, sem valores negativos!");
            return;
        }

        try {
            // Atualiza o botão para indicar que o envio começou.
            setCarregando(true);

            // POST envia os dados no corpo da requisição.
            // await aguarda a resposta do servidor.
            // O interceptor global do Axios configura o token
            // nas chamadas à API, conforme definido no projeto.
            const response = await axios.post(
                "http://localhost:5000/user/register",
                {
                    nome: nome.trim(),
                    email: email.trim(),
                    senha,

                    // Nome do campo esperado pelo controller.
                    confSenha: confirmarSenha,

                    idade: idadeNumero,
                    altura: alturaNumero,
                    peso: pesoNumero,

                    // Campos opcionais vazios são enviados como null.
                    objetivo: objetivo || null,
                    telefone: telefone.trim() || null,
                    status
                }
            );

            // Mostra a mensagem retornada pelo backend.
            alert(response.data.message);

            // Retorna à listagem após o cadastro bem-sucedido.
            navigate("/alunos");

        } catch (error) {
            // Registra o erro para auxiliar no diagnóstico.
            console.error(error);

            // error.response existe quando o servidor respondeu.
            // Sem resposta, informa uma falha de comunicação.
            alert(
                error.response
                    ? error.response.data?.message || "Erro ao cadastrar aluno!"
                    : "Não foi possível conectar ao servidor."
            );

        } finally {
            // Executa tanto no sucesso quanto no erro.
            setCarregando(false);
        }
    }

    // =========================================
    // INTERFACE DO FORMULÁRIO
    // =========================================

    return (
        <Layout>
            {/* Botão de navegação para a listagem. */}
            <button
                type="button"
                onClick={() => navigate("/alunos")}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition"
            >
                <ArrowLeft size={20} aria-hidden="true" />
                <span>Voltar para Alunos</span>
            </button>

            <div>
                {/* O tamanho do título aumenta a partir do breakpoint sm. */}
                <h1 className="text-3xl sm:text-4xl font-bold">
                    Cadastrar Aluno
                </h1>

                <p className="text-gray-500 mt-2 mb-8">
                    Cadastre um novo aluno no EvolutionFit.
                </p>

                {/* onSubmit executa a função de cadastro.
                    aria-busy informa quando o formulário está ocupado. */}
                <form
                    onSubmit={handleCadastrarAluno}
                    className="bg-white rounded-2xl shadow-md p-4 sm:p-8 space-y-6"
                    aria-busy={carregando}
                >
                    <Campo id="nome" titulo="Nome Completo" icone={User}>
                        {/* Campo controlado:
                            value lê o estado;
                            onChange atualiza o estado;
                            required exige preenchimento no navegador. */}
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite o nome do aluno"
                            autoComplete="name"
                            maxLength={100}
                            required
                            className={estiloCampo}
                        />
                    </Campo>

                    <Campo id="email" titulo="E-mail" icone={Mail}>
                        {/* type="email" ativa a validação do navegador
                            para o formato do endereço. */}
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite o e-mail"
                            autoComplete="email"
                            maxLength={100}
                            required
                            className={estiloCampo}
                        />
                    </Campo>

                    {/* Uma coluna em telas pequenas e duas a partir de md. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Campo id="senha" titulo="Senha" icone={Lock}>
                            {/* type="password" oculta os caracteres.
                                A proteção por hash ocorre no backend. */}
                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite uma senha"
                                autoComplete="new-password"
                                required
                                className={estiloCampo}
                            />
                        </Campo>

                        <Campo
                            id="confirmarSenha"
                            titulo="Confirmar Senha"
                            icone={Lock}
                        >
                            <input
                                id="confirmarSenha"
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                placeholder="Digite a senha novamente"
                                autoComplete="new-password"
                                required
                                className={estiloCampo}
                            />
                        </Campo>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Campo id="telefone" titulo="Telefone" icone={Phone}>
                            {/* type="tel" favorece o teclado de telefone
                                em dispositivos móveis; não aplica máscara. */}
                            <input
                                id="telefone"
                                type="tel"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="Ex.: (16) 99999-9999"
                                autoComplete="tel"
                                maxLength={20}
                                className={estiloCampo}
                            />
                        </Campo>

                        <Campo id="status" titulo="Status" icone={Activity}>
                            {/* O select atualiza o status selecionado. */}
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={estiloCampo}
                            >
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </Campo>
                    </div>

                    {/* As três medidas ficam lado a lado a partir de md. */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Campo id="idade" titulo="Idade" icone={Calendar}>
                            {/* min impede números negativos.
                                step="1" exige incrementos inteiros. */}
                            <input
                                id="idade"
                                type="number"
                                min="0"
                                step="1"
                                value={idade}
                                onChange={(e) => setIdade(e.target.value)}
                                placeholder="Ex.: 23"
                                className={estiloCampo}
                            />
                        </Campo>

                        <Campo
                            id="altura"
                            titulo="Altura (cm)"
                            icone={Ruler}
                            ajuda="Use centímetros inteiros: 175 para 1,75 m."
                        >
                            {/* min, max e step aplicam os limites no navegador.
                                O backend também valida a altura.
                                aria-describedby associa o texto de ajuda. */}
                            <input
                                id="altura"
                                type="number"
                                min="50"
                                max="300"
                                step="1"
                                value={altura}
                                onChange={(e) => setAltura(e.target.value)}
                                placeholder="Ex.: 175"
                                aria-describedby="altura-ajuda"
                                className={estiloCampo}
                            />
                        </Campo>

                        <Campo
                            id="peso"
                            titulo="Peso (kg)"
                            icone={Weight}
                            ajuda="Você pode informar até duas casas decimais."
                        >
                            {/* step="0.01" permite incrementos de 0,01 kg.
                                O limite máximo corresponde a DECIMAL(10,2). */}
                            <input
                                id="peso"
                                type="number"
                                min="0.01"
                                max="99999999.99"
                                step="0.01"
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                                placeholder="Ex.: 80,50"
                                aria-describedby="peso-ajuda"
                                className={estiloCampo}
                            />
                        </Campo>
                    </div>

                    <Campo id="objetivo" titulo="Objetivo" icone={Target}>
                        {/* A opção vazia permite não informar objetivo. */}
                        <select
                            id="objetivo"
                            value={objetivo}
                            onChange={(e) => setObjetivo(e.target.value)}
                            className={estiloCampo}
                        >
                            <option value="">Selecione o objetivo</option>
                            <option value="Hipertrofia">Hipertrofia</option>
                            <option value="Emagrecimento">Emagrecimento</option>
                            <option value="Condicionamento">Condicionamento</option>
                            <option value="Definição">Definição</option>
                        </select>
                    </Campo>

                    {/* Botões empilhados em telas pequenas
                        e lado a lado a partir de sm. */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t">
                        {/* type="button" evita enviar o formulário. */}
                        <button
                            type="button"
                            onClick={() => navigate("/alunos")}
                            disabled={carregando}
                            className="border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Cancelar
                        </button>

                        {/* type="submit" dispara o onSubmit do formulário.
                            disabled bloqueia novos cliques durante o envio. */}
                        <button
                            type="submit"
                            disabled={carregando}
                            className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >
                            {/* O ternário escolhe o texto conforme o estado. */}
                            {carregando ? "Cadastrando..." : "Salvar Aluno"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}