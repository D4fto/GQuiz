import prisma from "../config/db.js";
import { gameManager } from "../config/gameManager.js";
import { randomGame, levelGame } from "./games.js";

export async function startRandom(userId, numberOfQuestions, timeByQuestion, categories = false) {
  try{
    if(!gameManager.getUser(userId)){
      gameManager.addUser(userId)
    }
    const game = await new randomGame(numberOfQuestions, timeByQuestion, categories).init(userId)
    gameManager.setUserActualGame(userId, game)
    return true
  }catch(e){
    throw e
  }
}
export async function startLevel(gameManager, userId, levelId){
  try{
    if(!gameManager.getUser(userId)){
      gameManager.addUser(userId)
    }
    const game = await new levelGame(levelId, userId).init()
    gameManager.setUserActualGame(userId, game)
    return true
  }catch(e){
    console.log(e)
    throw e
  }
}

export async function finishLevel(userId, levelId, score) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      points: true
    }
  })
  const userHasLevel = await prisma.user_has_level.findUnique({
    where: {
      id_user_id_level: {
        id_level: levelId,
        id_user: userId
      }
    },
    select: {
      max_points: true
    }
  })
  
  if(userHasLevel){
    if(!userHasLevel.max_points>score){
      
      await prisma.user_has_level.update({
        where: {
          id_user_id_level:{
            id_level: levelId,
            id_user: userId
          }
        },
        data:{
          max_points: score
        }
      })
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          points: score-userHasLevel.max_points+user.points
        }
      })
    }
  }else{
    await prisma.user_has_level.create({
      data: {
        id_level: levelId,
        id_user: userId,
        max_points: score
      }
    })
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        points: user.points + score
      }
    })
  }
  const level = await prisma.level.findUnique({
    where: {
      id: levelId
    },
    include: {
      world: {
        select: {
          icon: true
        }
      },
      level_has_question:{
        select: {
          question: true
        }
      }
    }
  })
  const info = {
  ...level,
  totalWeight: level.level_has_question.reduce((sum, lhq) => {
    return sum + (lhq.question?.weight || 0)
  }, 0)
  }
  const nextLevel = await prisma.level.findFirst({
    where: {
      id_world: info.id_world,
      OR: [
        {
          number: { gt: info.number}
        },
        {
          AND: [
            { id: { gt: levelId}},
            { number: info.number}
          ]
        }
      ]
    },
    select: {
      id: true
    },
    orderBy: {
      number: 'asc'
    }
  })
  console.log(nextLevel)
  if(nextLevel){
    info.next = nextLevel.id
  }else{
    info.next = false
  }
  delete info.level_has_question
  info.score = score
  gameManager.removeUser(userId)
  return info
}

export async function finishRandom(userId, score) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      points: true
    }
  })
  
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      points: user.points + score
    }
  })
  const game = gameManager.getUser(userId).actualGame
  const questionsIds = game.questions.map((e)=>e.id)
  const totalWeight = (await prisma.question.aggregate({
    where: { 
      id: { in: questionsIds}
    },
    _sum: {
      weight: true
    }
  }))._sum.weight
  const info = {
    totalWeight: totalWeight,
    score: score,
    numberOfQuestions: game.numberOfQuestions,
    timeByQuestion: game.timeByQuestion,
    categories: game.categories
  }
  gameManager.removeUser(userId)
  return info
}
