import prisma from "../config/db.js"
import { getLevelQuestionsService } from "../services/levelService.js"

export async function getLevelQuestions(req,res) {
  const level = parseInt(req.params.level)
  
  const type = req.query.type || false
  
  try{
    const response = await getLevelQuestionsService(level, type)
    return res.status(200).send({data: response})
  }
  catch(e){
    return res.status(400).send({error: e})
  }
}

export async function addQuestionsToLevel(req,res) {
  const { questions } = req.body
  const level = parseInt(req.params.level)
  
  try{
    const data = []
    questions.map((e)=>{
      data.push({
        id_level: level,
        id_question: e
      })
    })
    const response = await prisma.level_has_question.createMany({
      data: data,
      skipDuplicates: true
    })
    return res.status(200).send({data: response, message: 'Questões adicionadas com sucesso'})
  }
  catch(e){
    return res.status(400).send({error: e})
  }
}
export async function removeQuestionsFromLevel(req,res) {
  const { questions } = req.body
  const level = parseInt(req.params.level)
  
  try{
    const response = await prisma.level_has_question.deleteMany({
      where: {
        id_level: level,
        id_question : {
          in: questions
        }
      }
    })
    return res.status(200).send({data: response, message: 'Questões removidas com sucesso'})
  }
  catch(e){
    return res.status(400).send({error: e})
  }
}

export async function getLevels(req,res) {
  try {
    const response = await prisma.level.findMany()
    return res.status(200).send({data: response})
  } catch (e) {
    return res.status(400).send({error: e})
  }
}

export async function createLevel(req,res) {
  const { data } = req.body

  try {
    const response = await prisma.level.create({
      data: data
    })
    return res.status(200).send({message: 'Level criado com sucesso', data: response})
  } catch (e) {
    return res.status(400).send({error: e})
  }
}

export async function updateLevel(req,res) {
  const { data } = req.body
  const id = parseInt(req.params.id)

  try {
    const response = await prisma.level.update({
      where: {
        id:id
      },
      data: data
    })
    return res.status(200).send({message: 'Level atualizado com sucesso', data: response})
  } catch (e) {
    return res.status(400).send({error: e})
  }
}

export async function deleteLevel(req,res) {
  const id = parseInt(req.params.id)
  try{
    await prisma.level_has_question.deleteMany({
      where: {
        id_level:id
      }
    })
    await prisma.world_has_level.deleteMany({
      where: {
        id_level:id
      }
    })
    await prisma.user_has_level.deleteMany({
      where: {
        id_level:id
      }
    })
    const response = await prisma.level.delete({
      where: {
        id:id
      }
    })
    return res.status(200).send({message: 'Level deletado com sucesso', data: response})
  }catch(e){
    return res.status(400).send({error: e})
  }
}


export async function getLevelsFromWorld(req, res){
  const world = parseInt(req.params.world)
  
  try{
  const levels = await prisma.level.findMany({
    where: {
      id_world: world
    },
    include: {
      level_has_question:{
        select: {
          question: true
        }
      }
    },
    orderBy: {
      number: 'asc'
    }
  })
  const result = levels.map(level => {
    const newLevel = {
    ...level,
    totalWeight: level.level_has_question.reduce((sum, lhq) => {
      return sum + (lhq.question?.weight || 0)
    }, 0)
    }
    delete newLevel.level_has_question
    return newLevel
  });
  res.send({data: result})
  }catch(e){
    res.status(400).send({error: e})
  }
};

