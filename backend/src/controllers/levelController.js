import prisma from "../config/db.js"


export async function getLevelsFromWorld(req,res) {
  const world = parseInt(req.params.world)
  
  try{
    const response = await prisma.world_has_level.findMany({
      where: {
        id_world: world
      },
      include: {
        level: {
          select: {
            number: true
          }
        }
      },
      orderBy: {
        level: {
          number: 'asc'
        }
      }
    })
    return res.status(200).send({data: response})
  }
  catch(e){
    return res.status(400).send({error: e})
  }
}

export async function getLevelQuestions(req,res) {
  const level = parseInt(req.params.level)
  
  try{
    const response = await prisma.level_has_question.findMany({
      where: {
        id_level: level
      },
      include: {
        question:{
          select: {
            title: true,
            weight: true,
            id_category: true,
            option: {
              select: {
                id: true,
                label: true
              }
            }
          }
        }
      },
      orderBy: {
        question: {
          id: 'asc'
        }
      }
    })
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
    return res.status(200).send({response: response, message: 'Questões adicionadas com sucesso'})
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
    return res.status(200).send({response: response, message: 'Questões removidas com sucesso'})
  }
  catch(e){
    return res.status(400).send({error: e})
  }
}

export async function getLevels(req,res) {
  try {
    const response = await prisma.level.findMany()
    return res.status(200).send({response: response})
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
    return res.status(200).send({message: 'Level atualizado com sucesso', response: response})
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
    return res.status(200).send({message: 'Level deletado com sucesso', response: response})
  }catch(e){
    return res.status(400).send({error: e})
  }
}
