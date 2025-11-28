import { verify } from "./jwt.js";
import { Server } from 'socket.io';
import { server } from "./server.js";
import { nextQuestionService, getActualQuestionService, answerQuestionService } from "../services/questionService.js";
import { gameManager } from "./gameManager.js";
import { startLevel, startRandom } from "../services/gameService.js";
import { generateId } from "../utils/generateId.js";
import { roomGame } from "../services/games.js";

const usersSockets = new Map()

export const rooms = new Map()

export function getUserSocket(id){
  return usersSockets.get(id)
}

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend address
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
  token = token.split("token=")[1].split(";")[0].trim();

  try {
    const payload = verify(token);
    socket.user = payload;
    next();
  } catch (e) {
    next(new Error("Token inválido"));
  }
});

io.on('connection', (socket) => {
  usersSockets.set(socket.user.id, socket.id)
  socket.on("nextQuestion", async ()=>{
    socket.emit("nextQuestion", {result: await nextQuestionService(socket.user.id)})
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
    socket.emit("answerQuestion",{result: await answerQuestionService(socket.user.id, index), score: gameManager.getUserScore(socket.user.id)})
  })

  socket.on("startRandom", async (numberOfQuestions, timeByQuestion, categories)=>{
    const userId = socket.user.id
    await startRandom(userId, numberOfQuestions, timeByQuestion, categories)
    const game = gameManager.getUser(userId).actualGame
    socket.emit("startRandom",{question: gameManager.getUserActualQuestion(userId), timeByQuestion: game.getTimeByQuestion(), time: game.setTimeToNow()})
  })

  socket.on("createRoom", (name, maxNumberOfPlayers, password = false)=>{
    const roomId = name + " " + generateId()
    socket.join(roomId)
    rooms.set(roomId, {
      password: password,
      maxNumberOfPlayers: maxNumberOfPlayers,
      numberOfPlayers: 1,
      host: socket.user.id,
      game: null
    })

    socket.emit("createRoom", roomId)
  })

  socket.on("startRoomGame", async (numberOfQuestions, timeByQuestion, categories = false)=>{
    const room = rooms.get(Array.from(socket.rooms)[1])
    const game = await new roomGame(Array.from(socket.rooms)[1],numberOfQuestions, timeByQuestion, categories).init()
    room.game = game
    game.addUser(socket.user.id, socket.user.username)
    gameManager.addUser(socket.user.id)
    gameManager.setUserActualGame(socket.user.id, game)
    console.log(game)
    socket.emit("roomGameCreated")
  })

  socket.on("joinRoom", (roomId, password = false)=>{
    const room = rooms.get(roomId)
    if(room.password){
      if(!room.password===password){
        throw new Error("Senha incorreta")
      }
    }
    socket.join(roomId)
    io.to(roomId).emit("playerEnter")
  })
  
  socket.on('disconnect', () => {
    usersSockets.delete(socket.user.id)
  });
}); 



