import prisma from "../config/db.js"
import { gameManager } from "../config/gameManager.js";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function getRandomQuestions(amount) {
  const questions = await prisma.question.findMany({
    include: {
      option: {
        select: {
          id: true,
          label: true,
          isCorrect: true
        }
      }
    }
  });

  return shuffle(questions).slice(0, amount);
}

export async function getRandomQuestionsByCategory(amount, categories) {
  let questions = await prisma.question.findMany({
    where: {
      id_category: { in: categories }
    },
    include: {
      option: {
        select: {
          id: true,
          label: true,
          isCorrect: true
        }
      }
    }
  });
  questions = shuffle(questions).slice(0, amount);
  if(questions.length<amount&&!categories.includes(1)){
    let response = await prisma.question.findMany({
      where: {
        id_category: 1
      },
      include: {
        option: {
          select: {
            id: true,
            label: true,
            isCorrect: true
          }
        }
      }
    });
    response = shuffle(response).slice(0,amount-questions.length)
    questions = shuffle(questions.concat(response))
  }

  return questions;
}

export async function answerQuestionService(userId,index){
  try{
    const user = gameManager.getUser(userId)
    if(!user){
      throw new Error("Usuário não está jogando")
    }
    const result = await user.actualGame.answerCurrentQuestion(index)
    return result
  }catch(e){
    console.log(e)
    throw e
  }
  
}
export async function nextQuestionService(userId){
  try{
    const user = gameManager.getUser(userId)
    if(!user){
      throw new Error("Usuário não está jogando")
    }
    const result = await user.actualGame.nextQuestion()
    return result
  }catch(e){
    console.log(e)
    throw e
  }
  
}
export async function getActualQuestionService(userId){
  try{
    const user = gameManager.getUser(userId)
    if(!user){
      throw new Error("Usuário não está jogando")
    }
    const result = await user.actualGame.getCurrentQuestion()
    return result
  }catch(e){
    console.log(e)
    throw e
  }
  
}
