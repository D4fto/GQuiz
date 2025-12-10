import { startRandom, startLevel } from "../services/gameService.js";
import { gameManager } from "../config/gameManager.js";
import { rooms } from "../config/io.js";

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

export function getRooms(req,res) {
  const formatedRooms = [...rooms].map((e)=>{
    return {
      id: e[0],
      hasPassword: Boolean(e[1].password),
      maxNumberOfPlayers: e[1].maxNumberOfPlayers,
      numberOfPlayers: e[1].numberOfPlayers,
      acceptingPlayers: e[1].game?.acceptingPlayers
    }
  })
  res.send({rooms: formatedRooms})
}
export function verifyPassword(req,res) {
  try{
    console.log("=============")
    console.log(req.body)
    const roomId = req.body.roomId
    const password = req.body.password
    const room = rooms.get(roomId)
    console.log(room)
    if(room.password === password){
      res.status(200).send({success: "senha correta"})
      return
    }
    res.status(401).send({error: "senha incorreta"})
    return

  }catch(e){
    res.status(400).send({error: e})
  }
  
}