
/*
 * Componente ProtectedRoute
 *
 * Responsável por controlar o acesso
 * às páginas protegidas do EvolutionFit.
 *
 * Verifica se existe um token armazenado
 * no localStorage do navegador.
 *
 * Caso não exista, redireciona o usuário
 * para a página de login.
 *
 * IMPORTANTE:
 * A existência do token não garante
 * que ele seja válido ou não tenha expirado.
 * A validação do JWT deve ser realizada
 * pelo backend nas rotas protegidas.
 */

// Importa o Navigate do React Router.
//
// Navigate permite redirecionar o usuário
// para outra página da aplicação.
import { Navigate } from "react-router-dom";


// Exporta o componente ProtectedRoute.
//
// children representa os componentes
// ou páginas que serão protegidos.
export default function ProtectedRoute({ children }) {

    // =========================================
    // RECUPERAR TOKEN
    // =========================================

    // Busca o token armazenado no navegador.
    //
    // localStorage: armazenamento local.
    // getItem("token"): recupera o token salvo.
    //
    // Se não existir, retorna null.
    const token = localStorage.getItem("token");


    // =========================================
    // VERIFICAR EXISTÊNCIA DO TOKEN
    // =========================================

    // O operador ! significa negação.
    //
    // Portanto, !token verifica se
    // não existe um token armazenado.
    if (!token) {

        // Redireciona o usuário para o login.
        //
        // to="/": define a rota de destino.
        //
        // replace: substitui a entrada atual
        // no histórico de navegação.
        //
        // Isso evita adicionar uma nova entrada
        // ao histórico durante o redirecionamento.
        return <Navigate to="/" replace />;

    }


    // =========================================
    // PERMITIR ACESSO À PÁGINA
    // =========================================

    // Se existe um token armazenado,
    // apresenta o componente protegido.
    //
    // Exemplo: Treinos, Agenda ou Avaliações.
    //
    // Essa verificação ocorre no frontend.
    // O backend deve validar o JWT antes
    // de fornecer dados protegidos.
    return children;

}
