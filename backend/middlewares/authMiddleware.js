import jwt from "jsonwebtoken";
import Usuarios from "../models/Usuarios.js";

export default async function authMiddleware(req, res, next) {

    // Recebe o cabeçalho enviado pelo frontend.
    // Formato esperado: Authorization: Bearer TOKEN
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Faça login para acessar o sistema!"
        });
    }

    // Separa a palavra Bearer do token.
    const partes = authorization.trim().split(/\s+/);

    if (
        partes.length !== 2 ||
        partes[0].toLowerCase() !== "bearer"
    ) {
        return res.status(401).json({
            message: "Formato do token inválido!"
        });
    }

    const token = partes[1];

    // Confere se a chave secreta foi configurada.
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: "A autenticação do servidor não está configurada!"
        });
    }

    let dadosToken;

    try {

        // Verifica a assinatura e a validade do token.
        dadosToken = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

    } catch {
        return res.status(401).json({
            message: "Token inválido ou expirado. Faça login novamente!"
        });
    }

    // Seu AuthController coloca o ID neste campo.
    if (
        !Number.isSafeInteger(dadosToken.id_number) ||
        dadosToken.id_number <= 0
    ) {
        return res.status(401).json({
            message: "Token sem identificação válida!"
        });
    }

    try {

        // Consulta o usuário e seu perfil atual no banco.
        const usuario = await Usuarios.findByPk(
            dadosToken.id_number,
            {
                attributes: ["id", "tipo_usuario"]
            }
        );

        if (!usuario) {
            return res.status(401).json({
                message: "Usuário não encontrado. Faça login novamente!"
            });
        }

        if (
            usuario.tipo_usuario !== "personal" &&
            usuario.tipo_usuario !== "aluno"
        ) {
            return res.status(403).json({
                message: "Perfil sem permissão de acesso!"
            });
        }

        // Disponibiliza a identidade verificada às próximas funções.
        req.usuario = {
            id: usuario.id,
            tipo_usuario: usuario.tipo_usuario
        };

        // Continua para a próxima etapa da requisição.
        return next();

    } catch {
        return res.status(500).json({
            message: "Erro ao verificar o usuário!"
        });
    }

}