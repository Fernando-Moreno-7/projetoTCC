// Função responsável por pegar o token JWT

const getToken = (req) => {
    // Pega o conteúdo do cabeçalho Authorization
    const authHeader = req.headers["authorization"];

    // Verifica se o cabeçalho existe
    // Depois separa "Bearer" do token usando o espaço
    const token = authHeader && authHeader.split(" ")[1];
    return token;
};

export default getToken;