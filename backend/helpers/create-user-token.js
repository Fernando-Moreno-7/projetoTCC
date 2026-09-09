import jwt from "jsonwebtoken";

const createUserToken = async (user, req, res) => {

    const token = jwt.sign(
        {
            id_number: user.id,
            name: user.nome,
            id: user.email,
            tipo: user.tipo_usuario
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "8h"
        }
    );


    return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
        userId: user.id,
        tipoUsuario: user.tipo_usuario
    });

};

export default createUserToken;