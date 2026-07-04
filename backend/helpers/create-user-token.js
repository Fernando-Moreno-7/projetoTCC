import jwt from 'jsonwebtoken';

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    // payload data
    {
      id_number: user.id,
      name: user.nome,
      id: user.email,
      tipo: user.tipo_usuario

    },
    process.env.JWT_SECRET
  );

  // return token
  res.status(200).json({
    message: "Você está autenticado!",
    token: token,
    userId: user.email,
  });
};

export default createUserToken;