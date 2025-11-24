import prisma from "../config/db.js";

export async function upateManyOptions(req,res) {
  const { data } = req.body;
  try{
    for (const element of data) {
      await prisma.option.update({
        where: {
          id: element.id
        },
        data: {
          label: element.label,
          isCorrect: element.isCorrect,
          id_question: element.id_question
        }
      })
    }
    return res.status(200).send({message: 'Opções atualizadas com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}
export async function getOptions(req,res){
  try{
    const response = await prisma.option.findMany()
    return res.status(200).send({data: response})
  }catch(e){
    return res.status(400).send({error: e})
  }
}

export async function createOption(req,res) {
  const { label,isCorrect,id_question } = req.body
  try{
    const response = await prisma.option.create({
      data: {
        label: label,
        id_question:id_question,
        isCorrect:isCorrect
      }
    })
    return res.status(200).send({data: response, message: 'Opção criada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}
export async function updateOption(req,res) {
  const { data } = req.body
  const id = parseInt(req.params.id)
  try{
    const response = await prisma.option.update({
      where:{
        id: id
      },
      data: data
    })
    return res.status(200).send({data: response, message: 'Options atualizada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}
export async function deleteOptions(req,res) {
  const id = parseInt(req.params.id)
  if(id===1){
    return res.status(401).send({error: "Não é possível deletar essa opção"}) 
    
  }
  try{
    const response = await prisma.option.delete({
      where:{
        id: id
      }
    })
    return res.status(200).send({data: response, message: 'Opção deletada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}