import prisma from "../config/db.js"
import { gameManager } from "../config/gameManager.js"

import { answerQuestionService, nextQuestionService, getActualQuestionService } from "../services/questionService.js"


export async function getQuestionsTitles(req,res) {
  try{
    const response = await prisma.question.findMany({
      select: {
        id: true,
        title: true
      }
    })
    return res.status(200).send({data: response})
  }catch(e){
    return res.status(400).send({error: e})
  }
}

export async function getQuestions(req,res) {
  try{
    const response = await prisma.question.findMany({
      include: {
        option: {
          select: {
            id: true,
            label: true,
            isCorrect: true
          }
        }
      }
    })
    return res.status(200).send({data: response})
  }catch(e){
    return res.status(400).send({error: e})
  }
}

export async function createQuestion(req,res) {
  const { data, corrects, wrongs } = req.body
  try{
    const response = await prisma.question.create({
      data: data
    })
    const options = []
    corrects.map((e)=>{
      options.push({
        label: e,
        isCorrect: true,
        id_question: response.id
      })
    })
    wrongs.map((e)=>{
      options.push({
        label: e,
        id_question: response.id
      })
    })
    await prisma.option.createMany({
      data: options
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
    await prisma.option.deleteMany({
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

export async function answerQuestion(req,res) {
  const index = req.params.index

  try {
    res.send({result: await answerQuestionService(req.user.id, index), score: gameManager.getUserScore(req.user.id)})
  } catch(e){
    console.log(e)
    res.status(400).send({error: e})
  }
}


export async function nextQuestion(req,res) {

  try {
    
    res.send()
  } catch(e){
    res.status(400).send({error: e})
  }
}
export async function getActualQuestion(req,res) {

  try {
    const game = gameManager.getUser(req.user.id).actualGame
    res.send({question: await getActualQuestionService(req.user.id), timeByQuestion: game.getTimeByQuestion(), time: game.setTimeToNow()})
  } catch(e){
    res.status(400).send({error: e})
  }
}