import { error } from "console";
import prisma from "../config/db.js";
import argon2 from "argon2";
import { sign } from "../config/jwt.js";

export async function login(req, res) {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userImgs: {
        select: {
          imgName: true
        }
      }
    }
  });
  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado" });
  }
  if (!(await argon2.verify(user.password,password))) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  const { token, jwtExpirySeconds } = sign({
    id: user.id,
    email: user.email,
    username: user.username,
    imgName: user.userImgs.imgName,
    isAdmin: user.isAdmin,
  })

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // obrigatório em HTTPS (Render usa HTTPS)
    sameSite: "none",    // necessário para frontend em outro domínio
    maxAge: jwtExpirySeconds * 1000,
  });

  console.log("sdpjasdpadosjasdodpasj")

  return res.status(200).send({message: "Usuário logado com sucesso"});
}

export function logout(req, res){
  res.cookie('token', '', {maxAge : 0 })
  res.status(200).send({message: "Usuário deslogado com sucesso"})
}

export async function createAccount(req, res){
  const { email, username, password } = req.body

  try{
    const countImgs = await prisma.userImgs.count()
    const { id } = await prisma.userImgs.findFirst({
      skip: Math.floor(Math.random() * countImgs)
    })
    const response = await prisma.user.create({
      data:{
        email: email,
        username: username,
        password: await argon2.hash(password),
        id_userImg: id
      },
    })
    console.log(response)
    res.status(200).send({message: "Usuário criado", response: response})
  } catch(e){
    console.log(e)
    
    res.status(400).send({error: e})
  }


}