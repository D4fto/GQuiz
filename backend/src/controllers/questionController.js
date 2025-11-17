import prisma from "../config/db.js"


export async function getQuestions(req,res) {
  try{
    const response = await prisma.question.findMany()
    return res.status(200).send({data: response})
  }catch(e){
    return res.status(400).send({error: e})
  }
}

export async function createQuestion(req,res) {
  const { data } = req.body
  try{
    const response = await prisma.question.create({
      data: data
    })
    return res.status(200).send({data: response, message: 'Pergunta criada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}

export async function updateQuestion(req,res) {
  const { data } = req.body
  const id = parseInt(req.params.id)
  
  try{
    const response = await prisma.question.update({
      where: {
        id: id
      },
      data: data
    })
    return res.status(200).send({data: response, message: 'Pergunta atualizada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}

export async function deleteQuestion(req,res) {
  const id = parseInt(req.params.id)
  
  try{
    await prisma.level_has_question.deleteMany({
      where:{
        id_question: id
      }
    })
    const response = await prisma.question.delete({
      where: {
        id: id
      }
    })
    return res.status(200).send({data: response, message: 'Pergunta deletada com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}