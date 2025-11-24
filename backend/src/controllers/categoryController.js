import prisma from "../config/db.js";

export async function getCategories(req,res){
  try{
    const response = await prisma.category.findMany({
      orderBy:{
        name: 'asc'
      }
    })
    return res.status(200).send({data: response})
  }catch(e){
    return res.status(400).send({error: e})
  }
}

export async function createCategory(req,res) {
  const { name } = req.body
  try{
    const response = await prisma.category.create({
      data: {
        name: name
      }
    })
    return res.status(200).send({data: response, message: 'Categoria criada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}
export async function updateCategory(req,res) {
  const { data } = req.body
  const id = parseInt(req.params.id)
  try{
    const response = await prisma.category.update({
      where:{
        id: id
      },
      data: data
    })
    return res.status(200).send({data: response, message: 'Categoria atualizada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}
export async function deleteCategory(req,res) {
  const id = parseInt(req.params.id)
  if(id===1){
    return res.status(401).send({error: "Não é possível deletar essa categoria"}) 
    
  }
  try{
    await prisma.question.updateMany({
      where: {
        id_category: id
      },
      data: {
        id_category: 1
      }
    })
    const response = await prisma.category.delete({
      where:{
        id: id
      }
    })
    return res.status(200).send({data: response, message: 'Categoria deletada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}