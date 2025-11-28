import { getQuestions } from "../controllers/questionController.js";
import { getLevelQuestionsService } from "./levelService.js";
import { verifyOption } from "./optionService.js";
import { getRandomQuestions, getRandomQuestionsByCategory } from "./questionService.js";
import { io, rooms } from "../config/io.js";

export class game {
  constructor() {
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.timeByQuestion=60;
    this.time=null
    this.tolerance=5
    this.penalty=.1
  }
  
  nextQuestion() {
    this.currentQuestionIndex++
    if(this.currentQuestionIndex>=this.questions.length){
      return false
    }
    return true
  }

  setTimeToNow(){
    this.time = Date.now()
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
    return this;
  } 

  getScore() {
    return this.score  
  }
  
  getUserScore(userId){
    return this.getScore()
  }

  getCurrentQuestion(){
    return this.questions[this.currentQuestionIndex]
  }

  async answerCurrentQuestion(indexOption){
    try{
      const isCorrect = await verifyOption(this.questions[this.currentQuestionIndex].option[indexOption].id)
      if(isCorrect){
        const diff = Math.floor((Date.now() - this.getQuestionTimeInit()) / 1000);
        const questionWeight = this.questions[this.currentQuestionIndex].weight
        if(diff<=this.tolerance){
          this.score+=questionWeight
        }else{
          this.score+=Math.floor(questionWeight*Math.max((this.getTimeByQuestion()-this.tolerance-diff)/(this.getTimeByQuestion()-this.tolerance)-this.penalty,0.5))
        }
      }
      return isCorrect
    }catch(e){
      throw e
    }
  }


}

export class randomGame extends game{
  constructor(numberOfQuestions, timeByQuestion, categories = false) {
    super()
    this.score = 0;
    this.numberOfQuestions = numberOfQuestions
    this.timeByQuestion = timeByQuestion
    this.categories = categories
  }
  async loadQuestions(){
    if(this.categories){
      return await getRandomQuestionsByCategory(this.numberOfQuestions, this.categories);
    }
    return await getRandomQuestions(this.numberOfQuestions);

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
  getScore() {
    return this.score  
  }
  
  getUserScore(userId){
    return this.getScore()
  }

  async answerCurrentQuestion(indexOption){
    try{
      const isCorrect = await verifyOption(this.questions[this.currentQuestionIndex].option[indexOption].id)
      if(isCorrect){
        const diff = Math.floor((Date.now() - this.getQuestionTimeInit()) / 1000);
        const questionWeight = this.questions[this.currentQuestionIndex].weight
        if(diff<=this.tolerance){
          this.score+=questionWeight
        }else{
          this.score+=Math.floor(questionWeight*Math.max((this.getTimeByQuestion()-this.tolerance-diff)/(this.getTimeByQuestion()-this.tolerance)-this.penalty,0.5))
        }
      }
      return isCorrect
    }catch(e){
      throw e
    }
  }
}

export class roomGame extends randomGame{
  constructor(roomId, numberOfQuestions, timeByQuestion, categories = false) {
    super(numberOfQuestions, timeByQuestion, categories = false)
    this.roomId = roomId
    this.users = new Map()
    this.answereds = new Map()
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

  getTop(length=5){
    const sorted = new Map(
      [...this.users.entries()].sort((a, b) => b[1].score - a[1].score)
    );
    return user.score;
  }

  addUser(userId, username){
    this.users.set(userId,{
      score: 0,
      username: username
    })
  }

  removeUser(userId){
    this.users.delete(userId)
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
      const isCorrect = await verifyOption(this.questions[this.currentQuestionIndex].option[indexOption].id)
      if(isCorrect){
        const diff = Math.floor((Date.now() - this.getQuestionTimeInit()) / 1000);
        const questionWeight = this.questions[this.currentQuestionIndex].weight
        if(diff<=this.tolerance){
          user.score+=questionWeight
        }else{
          user.score+=Math.floor(questionWeight*Math.max((this.getTimeByQuestion()-this.tolerance-diff)/(this.getTimeByQuestion()-this.tolerance)-this.penalty,0.5))
        }
      }
      io.to(this.roomId).emit("updateNumberOfAnswers", {
        answereds: this.answereds.size,
        numberOfPlayers: rooms.get(this.roomId)?.numberOfPlayers
      })
      if(this.answereds.size>=rooms.get(this.roomId)?.numberOfPlayers){
        io.to(this.roomId).emit("everyoneAnswered", {currentQuestionIndex: this.currentQuestionIndex, numberOfQuestions: this.numberOfQuestions})
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