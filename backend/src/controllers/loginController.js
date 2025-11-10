import prisma from "../config/db.js";
import { sign } from "../config/jwt.js";

export async function login(req, res) {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado" });
  }
  if (user.password !== password) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  const { token, jwtExpirySeconds } = sign({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  console.log("token:", token)

  res.cookie("token", token, { 
    maxAge: jwtExpirySeconds * 1000,
  })

  return res.status(200).send({message: "Usuário logado com sucesso"});
}

export function logout(req, res){
  res.cookie('token', '', {maxAge : 0 })
  res.status(200).send({message: "Usuário deslogado com sucesso"})
}
