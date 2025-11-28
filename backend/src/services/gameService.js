import { gameManager } from "../config/gameManager.js";
import { randomGame, levelGame } from "./games.js";

export async function startRandom(userId, numberOfQuestions, timeByQuestion, categories = false) {
  try{
    if(!gameManager.getUser(userId)){
      gameManager.addUser(userId)
    }
    const game = await new randomGame(numberOfQuestions, timeByQuestion, categories).init()
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
