// Importa a biblioteca jsonwebtoken,
// utilizada para criar e trabalhar com tokens JWT
import jwt from "jsonwebtoken";

// Função responsável por criar o token do usuário após o login
const createUserToken = async (user, req, res) => {

    // Gera e assina o token JWT
    const token = jwt.sign(
        {
            // Payload: dados do usuário armazenados no token
            id_number: user.id,
            name: user.nome,
            id: user.email,
            tipo: user.tipo_usuario
        },

        // Chave secreta armazenada nas variáveis de ambiente
        // utilizada para assinar o token
        process.env.JWT_SECRET,

        {
            // Define que o token será válido por 8 horas
            expiresIn: "8h"
        }
    );

    // Retorna uma resposta de sucesso para o frontend
    return res.status(200).json({
        // Mensagem informando que o login foi realizado
        message: "Login realizado com sucesso!",

        // Token JWT gerado
        token,

        // ID do usuário autenticado
        userId: user.id,

        // Tipo do usuário, como aluno ou professor
        tipoUsuario: user.tipo_usuario
    });

};

// Exporta a função para ser utilizada em outras partes do backend
export default createUserToken;