import { startRandom, startLevel } from "../services/gameService.js";
import { gameManager } from "../config/gameManager.js";

export async function onStartRandom(req,res) {
  try{
    const { numberOfQuestions, timeByQuestion, categories } = req.body
    const userId = req.user.id
    await startRandom(userId, numberOfQuestions, timeByQuestion, categories)
    const game = gameManager.getUser(userId).actualGame
    res.send({question: gameManager.getUserActualQuestion(userId), timeByQuestion: game.getTimeByQuestion(), time: game.setTimeToNow()})
  }catch(e){
    console.log(e)
    res.status(400).send({error: e})
  }
}

export async function onStartLevel(req,res) {
  const levelId = parseInt(req.params.id)
  const userId = parseInt(req.user.id)
  try{
    await startLevel(gameManager,userId,levelId)
    const game = gameManager.getUser(userId).actualGame

    res.send({question: gameManager.getUserActualQuestion(userId), timeByQuestion: game.getTimeByQuestion(), time: game.setTimeToNow()})
  }catch(e){
    console.log(e)
    res.status(400).send({error: e})
  }
}