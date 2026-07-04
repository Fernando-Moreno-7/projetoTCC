import Usuarios from "../models/Usuarios.js";
import bcrypt from "bcrypt";
import createUserToken from "../helpers/create-user-token.js";


export default class AuthController{
  // FUNÇÕES DO ALUNO E PERSONAL
    static async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // validations
    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória!" });
      return;
    }

    // check if user exists
    const user = await Usuarios.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(422)
        .json({ message: "Não há usuário cadastrado com este e-mail!" });
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.senha);

    if (!checkPassword) {
      return res.status(422).json({ message: "Senha inválida" });
    }

    await createUserToken(user, req, res);
  }
}