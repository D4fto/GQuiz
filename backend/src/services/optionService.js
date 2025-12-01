import prisma from "../config/db.js";

export async function verifyOption(optionId) {
  try{
    if(!optionId){
      return false
    }
    const response  = await prisma.option.findUnique({
      where: {
        id: optionId
      },
      select: {
        isCorrect: true
      }
    })
    return response.isCorrect
  } catch(e){
    throw e
  }
}

