import prisma from "../config/db.js";

export async function verifyOption(optionId) {
  try{
    const response  = await prisma.option.findUnique({
      where: {
        id: optionId
      },
      select: {
        isCorrect: true
      }
    })
    if(!response){
      throw new Error("Opção não existe")
    }
    return response.isCorrect
  } catch(e){
    throw e
  }
}

