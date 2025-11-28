import prisma from "../config/db.js";


export async function getUserImgs(req,res){
  try{
    const response = await prisma.userImgs.findMany()
    return res.status(200).send({data: response})
  }catch(e){
    return res.status(400).send({error: e})
  }
}

export async function createUserImgs(req,res) {
  const { imgName } = req.body
  try{
    const response = await prisma.userImgs.create({
      data: {
        imgName:imgName
      }
    })
    return res.status(200).send({data: response, message: 'Imagem do usuário criada com sucesso.'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}
export async function updateUserImgs(req,res) {
  const { data } = req.body
  const id = parseInt(req.params.id)
  try{
    const response = await prisma.userImgs.update({
      where:{
        id: id
      },
      data: data
    })
    return res.status(200).send({data: response, message: 'Imagem do usuário atualizada com sucesso.'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}
export async function deleteUserImgs(req,res) {
  const id = parseInt(req.params.id)
  if(id===1){
    return res.status(401).send({error: "Não é possível deletar essa imagem do usuário."}) 
    
  }
  try{
    const response = await prisma.userImgs.delete({
      where:{
        id: id
      }
    })
    return res.status(200).send({data: response, message: 'Imagem do usuário deletada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}