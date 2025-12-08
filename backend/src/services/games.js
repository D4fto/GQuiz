import { getQuestions } from "../controllers/questionController.js";
import { finishLevel, finishRandom } from "./gameService.js";
import { getLevelQuestionsService } from "./levelService.js";
import { verifyOption } from "./optionService.js";
import { getRandomQuestions, getRandomQuestionsByCategory } from "./questionService.js";
import { io, rooms, getUserSocket, usersSockets } from "../config/io.js";
import prisma from "../config/db.js";

export class game {
  constructor() {
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.timeByQuestion=5;
    this.time=null
    this.tolerance=5
    this.penalty=.1
    this.type="default"
    this.timeout=null
  }

  finish(){
    return true
  }
  
  nextQuestion() {
    this.currentQuestionIndex++
    if(this.currentQuestionIndex>=this.questions.length){
      return false
    }
    return true
  }

  timeOutHandler(){

  }

  setTimeToNow(){
    this.time = Date.now()
    clearTimeout(this.timeout)
    this.timeout = setTimeout(()=>this.timeOutHandler(),this.timeByQuestion*1000)
    return this.time
  }

  getUserScore(userId){
    return 0;
  }

  getQuestionTimeInit(){
    return this.time
  }

  getTimeByQuestion(){
    return this.timeByQuestion
  }

  getCurrentQuestion(){
    console.log("getCurrentQuestion")
    return this.questions[this.currentQuestionIndex]
  }

  async answerCurrentQuestion(indexOption){
    try{
      const isCorrect = await verifyOption(this.questions[this.currentQuestionIndex].option[indexOption].id)
      return isCorrect
    }catch(e){
      throw e
    }
  }
}


export class levelGame extends game{
  constructor(id_level, userId) {
    super()
    this.id_level = id_level;
    this.userId = userId;
    this.score = 0;
    this.type="level"

  }
  
  async init() {
    const response = await getLevelQuestionsService(this.id_level);
    response.sort(() => Math.random() - 0.5);
    
    this.questions = response.map((e)=>{
      e.question.option.sort(() => Math.random() - 0.5);
      return e.question;
    });
    if(this.questions.length<=0){
      throw new Error("Level sem questões")
    }
    this.currentQuestionIndex = 0;
    console.log(this.userId)
    return this;
  } 

  getScore() {
    return this.score  
  }
  
  getUserScore(userId){
    return this.getScore()
  }
  
  timeOutHandler(){
    console.log(this.userId)
    io.to(getUserSocket(this.userId)).emit("timeout")
  }

  getCurrentQuestion(){
    return this.questions[this.currentQuestionIndex]
  }

  async finish(){
    console.log(this.userId)
    return await finishLevel(this.userId, this.id_level, this.score)
  }

  async answerCurrentQuestion(indexOption){
    try{
      const isCorrect = await verifyOption(this.questions[this.currentQuestionIndex].option[indexOption]?.id)
      if(isCorrect){
        const diff = Math.floor((Date.now() - this.getQuestionTimeInit()) / 1000);
        const questionWeight = this.questions[this.currentQuestionIndex].weight
        if(diff<=this.tolerance){
          this.score+=questionWeight
        }else{
          this.score+=Math.floor(questionWeight*Math.max((this.getTimeByQuestion()-this.tolerance-diff)/(this.getTimeByQuestion()-this.tolerance)-this.penalty,0.5))
        }
      }
      clearTimeout(this.timeout)
      return isCorrect
    }catch(e){
      throw e
    }
  }


}

export class randomGame extends game{
  constructor(numberOfQuestions, timeByQuestion, categories = false, hasQuickTime = false) {
    super()
    this.hasQuickTime = hasQuickTime
    this.score = 0;
    this.numberOfQuestions = numberOfQuestions
    this.timeByQuestion = timeByQuestion
    this.categories = categories
    this.type="random"
    this.quickEvents = [
      {
        type: "word",
        get: async ()=>await this.getWordEvent()
      },
      {
        type: "color",
        get: async ()=>this.getColorEvent()
      }
    ]
    this.colors = [
      { nome: "vermelho",        cor: "#FF0000" },
      { nome: "azul",            cor: "#0000FF" },
      { nome: "verde",           cor: "#00FF00" },
      { nome: "amarelo",         cor: "#FFFF00" },
      { nome: "laranja",         cor: "#FFA500" },
      { nome: "roxo",            cor: "#800080" },
      { nome: "rosa",            cor: "#FFC0CB" },
      { nome: "preto",           cor: "#000000" },
      { nome: "cinza",           cor: "#808080" },
      { nome: "ciano",           cor: "#00FFFF" },
      { nome: "magenta",         cor: "#FF00FF" },
      { nome: "marrom",          cor: "#8B4513" },
      { nome: "bordô",           cor: "#800020" },
      { nome: "vinho",           cor: "#722F37" },
      { nome: "turquesa",        cor: "#40E0D0" },
      { nome: "azul marinho",    cor: "#000080" },
      { nome: "verde limão",     cor: "#32CD32" },
      { nome: "verde água",      cor: "#00FA9A" },
      { nome: "dourado",         cor: "#FFD700" },
    ];
    this.quickAnswer=null
    this.userId=null
  }
  async loadQuestions(){
    if(this.categories){
      return await getRandomQuestionsByCategory(this.numberOfQuestions, this.categories);
    }
    return await getRandomQuestions(this.numberOfQuestions);

  }
  async init(userId) {
    this.userId = userId
    const response = await this.loadQuestions()
    response.sort(() => Math.random() - 0.5);
    
    this.questions = response.map((e)=>{
      e.option.sort(() => Math.random() - 0.5);
      return e;
    });
    if(this.questions.length<=0){
      throw new Error("Não há questões")
    }
    this.numberOfQuestions = this.questions.length
    this.currentQuestionIndex = 0;

    return this;
  }
  
  async getWordEvent(){
    try{
      const response = await fetch('https://api.dicionario-aberto.net/random');
      const data = await response.json();
      this.quickAnswer = data.word
      return { word: data.word}
    }
    catch(e){
      this.quickAnswer = "cavaleiro"
      return {
        word: "cavaleiro"
      }
      
    }
  } 

  getColorEvent(){
    let correctIndex = 0
    const correct = this.colors[Math.floor(Math.random() * this.colors.length)];
    const type = Math.random()>.5?"word":"color"
    const totalOptions = 4;
    const wrong = this.colors
      .filter(c => c.nome !== correct.nome)
      .sort(() => Math.random() - 0.5)
      .slice(0, totalOptions - 1);
  
    const baseOptions = [correct, ...wrong].sort(()=> Math.random() - 0.5);
    const shuffledColors = baseOptions
      .map(c => c.cor)
      .sort(() => Math.random() - 0.5);
    
    const options = baseOptions.map((opt, index) => {
      if(type === "word"){
        if(opt.nome === correct.nome){
          correctIndex = index
        }
      }else{
        if(shuffledColors[index] === correct.cor){
          correctIndex = index
        }
      }
      return{
        nome: opt.nome,              
        cor: shuffledColors[index],   
        index: index
      }
    });
    this.quickAnswer = correctIndex
    console.log(correctIndex + " color")
    return{
      type,
      correct,
      options
    }
  }
    

  getScore() {
    return this.score  
  }
  async finish({userId}){
    return await finishRandom(userId, this.score)
  }
  
  getUserScore(userId){
    return this.getScore()
  }
  timeOutHandler(){
    console.log(this.userId)
    io.to(getUserSocket(this.userId)).emit("timeout")
  }
  
  async nextQuestion() {
    if(this.hasQuickTime && this.quickAnswer===null){
      if(Math.random()<.15){
        // const event = this.quickEvents[Math.floor(Math.random() * this.quickEvents.length)];
        const event = this.quickEvents[1];
        const data = await event.get()
        io.to(getUserSocket(this.userId)).emit("quickTimeEvent", {
          type: event.type,
          data: data
        })
        return "quickTimeEvent"
      }
    }
    this.quickAnswer=null
    this.currentQuestionIndex++
    if(this.currentQuestionIndex>=this.questions.length){
      return false
    }
    return true
  }

  async answerCurrentQuestion(indexOption){
    try{
      const isCorrect = await verifyOption(this.questions[this.currentQuestionIndex].option[indexOption]?.id)
      if(isCorrect){
        const diff = Math.floor((Date.now() - this.getQuestionTimeInit()) / 1000);
        const questionWeight = this.questions[this.currentQuestionIndex].weight
        if(diff<=this.tolerance){
          this.score+=questionWeight
        }else{
          this.score+=Math.floor(questionWeight*Math.max((this.getTimeByQuestion()-this.tolerance-diff)/(this.getTimeByQuestion()-this.tolerance)-this.penalty,0.5))
        }
      }
      clearTimeout(this.timeout)
      return isCorrect
    }catch(e){
      throw e
    }
  }
}

export class roomGame extends randomGame{
  constructor(roomId, numberOfQuestions, timeByQuestion, categories = false, hasQuickTime= false) {
    super(numberOfQuestions, timeByQuestion, categories = false, hasQuickTime = false)
    this.roomId = roomId
    this.users = new Map()
    this.answereds = new Map()
    this.acceptingPlayers = true
    this.type="room"
  }
  async init() {
    const response = await this.loadQuestions()
    response.sort(() => Math.random() - 0.5);
    
    this.questions = response.map((e)=>{
      e.option.sort(() => Math.random() - 0.5);
      return e;
    });
    if(this.questions.length<=0){
      throw new Error("Não há questões")
    }
    this.numberOfQuestions = this.questions.length
    this.currentQuestionIndex = 0;
    return this;
  } 
  
  getUserScore(userId){
    const user = this.users.get(userId);
    if (!user) {
        throw new Error('User not found.');
    }
    return user.score;
  }

  getTop(length=false){
    const sorted = new Map(
      [...this.users.entries()].sort((a, b) => b[1].score - a[1].score)
    ); 
    
    if (length) {
      return [...sorted].slice(0, length).map(([id, data]) => ({ id, ...data }));
    }
    return [...sorted].map(([id, data]) => ({ id, ...data }));
  }

  addUser(userId, username, imgName){
    this.users.set(userId,{
      score: 0,
      username: username,
      imgName: imgName,
      lastScore: 0
    })
  }

  removeUser(userId){
    this.users.delete(userId)
  }

  timeOutHandler(){
    this.users.forEach((value, key)=>{
      if(this.answereds.get(key)){
        return
      }
      console.log(key)
      io.to(getUserSocket(key)).emit("timeout")
    })
    io.to(this.roomId).emit("everyoneAnswered", {currentQuestionIndex: this.currentQuestionIndex, numberOfQuestions: this.numberOfQuestions})
    setTimeout(()=>{
      this.answereds.clear()
      this.nextQuestion()
    },5000)
  }

  async nextQuestion() {
    this.currentQuestionIndex++
    if(this.currentQuestionIndex>=this.questions.length){
      const result = await this.finish()
      io.to(this.roomId).emit("finished", {result: result})
      return false
    }
    io.to(this.roomId).emit("nextQuestion", {result: this.currentQuestionIndex<this.questions.length})
    return true
  }

  async finish(){
    await this.users.forEach(async (value, key) => {
      await prisma.user.update({
        where: {id: key},
        data: {
          points: { increment: value.score}
        }
      })
    });
    const info = {top: this.getTop()}
    this.acceptingPlayers=false
    this.users.clear()
    this.answereds.clear()
    const newRoom = rooms.get(this.roomId)
    if(newRoom){
      newRoom.numberOfPlayers=0
      rooms.set(this.roomId, newRoom)
    }

    return info
  }



  async answerCurrentQuestion(indexOption, userId){
    try{
      const user = this.users.get(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      if(this.answereds.get(userId)){
        return false
      }
      const isCorrect = await verifyOption(this.questions[this.currentQuestionIndex].option[indexOption]?.id)
      if(isCorrect){
        const diff = Math.floor((Date.now() - this.getQuestionTimeInit()) / 1000);
        const questionWeight = this.questions[this.currentQuestionIndex].weight
        if(diff<=this.tolerance){
          user.score+=questionWeight
        }else{
          user.score+=Math.floor(questionWeight*Math.max((this.getTimeByQuestion()-this.tolerance-diff)/(this.getTimeByQuestion()-this.tolerance)-this.penalty,0.5))
        }
      }
      this.answereds.set(userId,true)
      io.to(this.roomId).emit("updateNumberOfAnswers", {
        answereds: this.answereds.size
      })
      if(this.answereds.size>=rooms.get(this.roomId)?.numberOfPlayers){
        io.to(this.roomId).emit("everyoneAnswered", {currentQuestionIndex: this.currentQuestionIndex, numberOfQuestions: this.numberOfQuestions})
        clearTimeout(this.timeout)
        setTimeout(()=>{
          this.answereds.clear()
          this.nextQuestion()
        },5000)
      }
      return isCorrect
    }catch(e){
      throw e
    }
  }
}

async function teste() {
  const level = await new randomGame(3,60,[53,73]).init();
  console.log('--- TESTE ---');
  console.log(level);
  while(true){
    const isCorrect = await level.answerCurrentQuestion(0)
    console.log(isCorrect)
    const answer = level.nextQuestion()
    console.log(level.getUserScore())
    if(!answer){
      break
    }
  }
}



// teste()