import prisma from "../config/db.js"
import { gameManager } from "../config/gameManager.js"
import { levelGame } from "./games.js"

export async function getLevelQuestionsService(id_level, type = false) {
  try{
    const query = {
      where: {
        id_level: id_level
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
    }
    if(type == 'simple'){
      delete query.include.question.select.option
    }
    const response = await prisma.level_has_question.findMany(query)
    return response
  } catch(e){
    throw new Error(e)
  }
}



