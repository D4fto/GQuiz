import { verify } from "./jwt.js";
import { Server } from 'socket.io';
import { server } from "./server.js";
import { nextQuestionService, getActualQuestionService, answerQuestionService } from "../services/questionService.js";
import { gameManager } from "./gameManager.js";
import { startLevel, startRandom } from "../services/gameService.js";
import { generateId } from "../utils/generateId.js";
import { levelGame, randomGame, roomGame } from "../services/games.js";
import * as dotenv from "dotenv";
dotenv.config();

export const usersSockets = new Map()

export const rooms = new Map()

const waitingHost = new Map()

export function getUserSocket(id){
  return usersSockets.get(id)
}

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL, 
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

io.use((socket, next) => {
  let token = socket.handshake.headers.cookie;
  if (!token) {
    return next(new Error("Token não encontrado"));
  }
  token = token.split("token=")[1]?.split(";")[0].trim();

  try {
    const payload = verify(token);
    socket.user = payload;
    next();
  } catch (e) {
    next(new Error("Token inválido"));
  }
});

io.on('connection', (socket) => {
  if(usersSockets.get(socket.user.id)){
    const user = gameManager.getUser(socket.user.id)
    if(user?.actualGame?.type=="room"){
      socket.join(user.actualGame.roomId)
      const room = rooms.get(Array.from(socket.rooms)[1])
      const playersArray = Array.from(room.game?.users.entries()).map(([id, user]) => ({
        id,
        username: user.username,
        imgName: user.imgName
      }));
      socket.emit('joinedInRoom',
        room.game.timeByQuestion,
        playersArray, 
        {
          id: user.actualGame.roomId,
          maxNumberOfPlayers: room.maxNumberOfPlayers,
          numberOfPlayers: room.numberOfPlayers,
          host: room.host
        }
      )
    }
  }
  usersSockets.set(socket.user.id, socket.id)
  socket.on("nextQuestion", async ()=>{
    const notFinished = await nextQuestionService(socket.user.id)
    if(notFinished==="quickTimeEvent"){
      return
    }
    if(notFinished){
      socket.emit("nextQuestion")
      return
    }
    const typesHandler = {
      level: {},
      random: {userId: socket.user.id}
    }
    const result = await gameManager.getUser(socket.user.id).actualGame?.finish(typesHandler[gameManager.getUser(socket.user.id).actualGame?.type])
    socket.emit("finished", {result: result})
  })

  socket.on("actualQuestion", async ()=>{
    const game = gameManager.getUser(socket.user.id).actualGame
    socket.emit("actualQuestion",{question: await getActualQuestionService(socket.user.id), timeByQuestion: game.getTimeByQuestion(), time: game.setTimeToNow()})
  })

  socket.on("startLevel", async (id)=>{
    await startLevel(gameManager,socket.user.id,id)
    const game = gameManager.getUser(socket.user.id).actualGame
    socket.emit("startLevel", {question: gameManager.getUserActualQuestion(socket.user.id), timeByQuestion: game.getTimeByQuestion(), time: game.setTimeToNow()})
  })

  socket.on("answerQuestion", async (index)=>{
    if(gameManager.getUser(socket.user.id)?.actualGame.roomId){
      socket.emit("waitingAnswers",{result: await answerQuestionService(socket.user.id, index), score: gameManager.getUserScore(socket.user.id) })
      return
    }
    socket.emit("answerQuestion",{result: await answerQuestionService(socket.user.id, index), score: gameManager.getUserScore(socket.user.id)})
  })
  
  socket.on("answerQuick", (answer)=>{
    if(gameManager.getUser(socket.user.id)?.actualGame.roomId){
      socket.emit("waitingAnswers",{result: gameManager.getUser(socket.user.id)?.actualGame?.answerQuick(answer, socket.user.id), score: gameManager.getUserScore(socket.user.id) })
      
      return
    }
    gameManager.getUser(socket.user.id)?.actualGame?.answerQuick(answer)
  })

  socket.on("startRandom", async (numberOfQuestions, timeByQuestion, categories = false, hasQuickTime = false)=>{
    const userId = socket.user.id
    await startRandom(userId, numberOfQuestions, timeByQuestion, categories, hasQuickTime)
    const game = gameManager.getUser(userId).actualGame
    socket.emit("startRandom",{question: gameManager.getUserActualQuestion(userId), timeByQuestion: game.getTimeByQuestion(), time: game.setTimeToNow()})
  })

  socket.on("createRoom", (name, maxNumberOfPlayers, password = false)=>{
    if(Array.from(socket.rooms)[1]){
      return
    }
    const roomId = name + " " + generateId()
    socket.join(roomId)
    rooms.set(roomId, {
      id: roomId,
      password: password,
      maxNumberOfPlayers: maxNumberOfPlayers,
      numberOfPlayers: 1,
      host: socket.user.id,
      game: null
    })

    socket.emit("roomCreated", roomId)
  })

  socket.on("startRoomGame", async (numberOfQuestions, timeByQuestion, categories = false, hasQuickTime = false)=>{
    const room = rooms.get(Array.from(socket.rooms)[1])
    const game = await new roomGame(Array.from(socket.rooms)[1],numberOfQuestions, timeByQuestion, categories, hasQuickTime).init()
    room.game = game
    const user = socket.user
    game.addUser(socket.user.id, socket.user.username, socket.user.imgName)
    gameManager.addUser(socket.user.id)
    gameManager.setUserActualGame(socket.user.id, game)

    socket.emit("roomGameCreated", 
      timeByQuestion,
      {
        id: user.id,
        username: user.username,
        imgName: user.imgName
      }, 
      {
        id: Array.from(socket.rooms)[1],
        maxNumberOfPlayers: room.maxNumberOfPlayers,
        numberOfPlayers: room.numberOfPlayers,
        host: room.host
      }
    )
  })

  socket.on("joinRoom", (roomId, password = false)=>{
    const room = rooms.get(roomId)
    if(!room){
      socket.emit('roomClosed')
      return
    }
    if(room?.numberOfPlayers>=room?.maxNumberOfPlayers){
      console.log("full")
      socket.emit("roomFull")
      return
    }
    if(room.password){
      if(!room.password===password){
        console.log("pass")
        socket.emit("wrongPassword")
        return
      }
    }
    console.log("join")
    socket.join(roomId)
    const user = socket.user
    gameManager.addUser(user.id)
    gameManager.setUserActualGame(user.id, room.game)
    room.game.addUser(user.id, user.username, user.imgName)
    io.to(roomId).emit("playerEnter", {
      id: user.id,
      username: user.username,
      imgName: user.imgName
    })
    room.numberOfPlayers++
    const playersArray = Array.from(room.game?.users.entries()).map(([id, user]) => ({
      id,
      username: user.username,
      imgName: user.imgName
    }));
    socket.emit('joinedInRoom',
      room.game.timeByQuestion,
      playersArray, 
      {
        id: roomId,
        maxNumberOfPlayers: room.maxNumberOfPlayers,
        numberOfPlayers: room.numberOfPlayers,
        host: room.host
      }
    )
  })

  socket.on("leaveRoom",()=>{
    const room = rooms.get(Array.from(socket.rooms)[1])
    io.to(Array.from(socket.rooms)[1]).emit("playerLeave", socket.user.id)
    room?.game?.removeUser(socket.user.id)
    gameManager.removeUser(socket.user.id)
    if(room?.host==socket.user.id){
      if(room.game){
        room.game.users.forEach((value, key) => {
          gameManager.setUserActualGame(key, null)
        });
      }
      rooms.delete(Array.from(socket.rooms)[1])
      waitingHost.delete(Array.from(socket.rooms)[1])
      io.to(Array.from(socket.rooms)[1]).emit("roomClosed")
      io.socketsLeave(Array.from(socket.rooms)[1])

    }
    if(room?.numberOfPlayers==1){
      rooms.delete(Array.from(socket.rooms)[1])
      waitingHost.delete(Array.from(socket.rooms)[1])
    }else{
      if(room){
        room.numberOfPlayers--
      }
    }
    
  })
  
  socket.on('initRoomGame',()=>{
    const room = rooms.get(Array.from(socket.rooms)[1])
    if(!(room?.host === socket.user.id)){
      return
    }
    
    const usersIds = Array.from(room.game.users.keys()).map((e)=>usersSockets.get(e))
    
    const roomSockets = io.sockets.adapter.rooms.get(Array.from(socket.rooms)[1])
    if (roomSockets) {
      console.log((Array.from(room.game.users.keys())))
      console.log((usersIds))
      const socketIds = Array.from(roomSockets);
      for (const element of socketIds) {
        console.log(element)
        console.log(usersIds.includes(element))
        if(!usersIds.includes(element)){
          console.log(element + ' sadkloayuisdoahsda')
          io.sockets.sockets.get(element)?.leave(room.id);
        }
      }
      console.log("Sockets na sala:", socketIds);
    } else {
      console.log("Sala não encontrada");
    }
    setTimeout(() => {
      console.log("Depois:", io.sockets.adapter.rooms.get(room.id));
    }, 0);
    console.log(room.id)
    const question = room.game.getCurrentQuestion()
    const timeByQuestion = room.game.getTimeByQuestion()
    room.game.setTimeToNow()
    room.game.acceptingPlayers = false
    const time = room.game.getQuestionTimeInit()


    io.to(room.id).emit('gameInitialized', {question, timeByQuestion, time})

  })

  socket.on('playRoomAgain', async ()=>{
    const roomId = Array.from(socket.rooms)[1]
    const room = rooms.get(roomId)
    const user = socket.user
    if(socket.user.id==room?.host){
      await room.game.init()
      
      room.numberOfPlayers++
      room.game.addUser(user.id, user.username, user.imgName)
      socket.emit("roomGameCreated", 
        room.game.timeByQuestion,
        {
          id: user.id,
          username: user.username,
          imgName: user.imgName
        }, 
        {
          id: Array.from(socket.rooms)[1],
          maxNumberOfPlayers: room.maxNumberOfPlayers,
          numberOfPlayers: room.numberOfPlayers,
          host: room.host
        }
      )
      room.game.acceptingPlayers=true
      console.log(waitingHost)
      waitingHost.get(roomId)?.map((user)=>{
        console.log(user)
        room.game.addUser(user.id, user.username, user.imgName)
        room.numberOfPlayers++
        const playersArray = Array.from(room.game?.users.entries()).map(([id, user]) => ({
          id,
          username: user.username,
          imgName: user.imgName
        }));
        socket.emit("playerEnter", {
          id: user.id,
          username: user.username,
          imgName: user.imgName
        })
        io.to(usersSockets.get(user.id)).emit('joinedInRoom',
          room.game.timeByQuestion,
          playersArray, 
          {
            id: roomId,
            maxNumberOfPlayers: room.maxNumberOfPlayers,
            numberOfPlayers: room.numberOfPlayers,
            host: room.host
          }
        )
      })
      
      waitingHost.delete(roomId)
      return
    }
    if(room?.game?.acceptingPlayers===false){
      socket.emit("waitingHost")
      if(waitingHost.get(roomId)){
        waitingHost.set(roomId,[...waitingHost.get(roomId),{id: user.id, username: user.username, imgName: user.imgName}])
        console.log(waitingHost)
        return
      }
      waitingHost.set(roomId, [{id: user.id, username: user.username, imgName: user.imgName}])
      console.log(waitingHost)
      return
    }
    
    room?.game.addUser(user.id, user.username, user.imgName)
    io.to(roomId).emit("playerEnter", {
      id: user.id,
      username: user.username,
      imgName: user.imgName
    })
    if(room){
      room.numberOfPlayers++

    }
    const playersArray = Array.from(room.game?.users.entries()).map(([id, user]) => ({
      id,
      username: user.username,
      imgName: user.imgName
    }));
    socket.emit('joinedInRoom',
      room.game.timeByQuestion,
      playersArray, 
      {
        id: roomId,
        maxNumberOfPlayers: room.maxNumberOfPlayers,
        numberOfPlayers: room.numberOfPlayers,
        host: room.host
      }
    )
  })
  
  socket.on("disconnecting", () => {
    const room = rooms.get(Array.from(socket.rooms)[1])
    if(usersSockets.get(socket.user.id)==socket.id){
      io.to(Array.from(socket.rooms)[1]).emit("playerLeave", socket.user.id)
      room?.game?.removeUser(socket.user.id)
      gameManager.removeUser(socket.user.id)
    if(room?.host==socket.user.id){
      if(room.game){
        room.game.users.forEach((value, key) => {
          gameManager.setUserActualGame(key, null)
        });
        room.game.users.clear()
      }
      rooms.delete(Array.from(socket.rooms)[1])
      waitingHost.delete(Array.from(socket.rooms)[1])
      io.to(Array.from(socket.rooms)[1]).emit("roomClosed")
      io.socketsLeave(Array.from(socket.rooms)[1])

    }
      if(room?.numberOfPlayers==1){
        rooms.delete(Array.from(socket.rooms)[1])
        waitingHost.delete(Array.from(socket.rooms)[1])
      }else{
        if(room){
          room.numberOfPlayers--
        }
      }
    }
  });
  
  socket.on('disconnect', () => {
    if(usersSockets.get(socket.user.id)==socket.id){
      usersSockets.delete(socket.user.id)
    }
  });
}); 



