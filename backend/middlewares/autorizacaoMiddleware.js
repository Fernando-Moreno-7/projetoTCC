// Permite continuar somente se o usuário tiver um dos perfis informados.
export function permitirPerfis(...perfisPermitidos) {

    return (req, res, next) => {

        // A identidade deve ter sido verificada pelo authMiddleware.
        if (!req.usuario) {
            return res.status(401).json({
                message: "Faça login para continuar!"
            });
        }

        if (!perfisPermitidos.includes(req.usuario.tipo_usuario)) {
            return res.status(403).json({
                message: "Você não tem permissão para realizar esta ação!"
            });
        }

        return next();
    };

}

// Usado na consulta GET /user/:id.
export function permitirProprioUsuarioOuPersonal(req, res, next) {

    if (!req.usuario) {
        return res.status(401).json({
            message: "Faça login para continuar!"
        });
    }

    const idSolicitado = Number(req.params.id);

    if (
        !Number.isSafeInteger(idSolicitado) ||
        idSolicitado <= 0
    ) {
        return res.status(422).json({
            message: "Informe um ID de usuário válido!"
        });
    }

    // O personal pode consultar os cadastros.
    if (req.usuario.tipo_usuario === "personal") {
        return next();
    }

    // O aluno só pode consultar o próprio cadastro.
    if (
        req.usuario.tipo_usuario === "aluno" &&
        idSolicitado === Number(req.usuario.id)
    ) {
        return next();
    }

    return res.status(403).json({
        message: "Você não pode acessar o cadastro de outro usuário!"
    });
}