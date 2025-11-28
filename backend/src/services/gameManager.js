import { levelGame } from "./games.js";
export default class GameManager {
    constructor() {
        this.users = new Map(); // Store user sessions with userId as key
        this.games = new Map(); // Store active games with gameId as key
    }
    getUser(userId) {
        return this.users.get(userId);
    }
    setUserActualGame(userId, game) {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        user.actualGame = game;
        this.users.set(userId, user);
    }
    addUser(userId) {
        this.users.set(userId, { actualGame: null });
    }
    removeUser(userId) {
        this.users.delete(userId)
    }
    getUserActualQuestion(userId){
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        if(!user.actualGame){
            throw new Error('User is not in a game.');
        }
        return user.actualGame.getCurrentQuestion()

    }
    getUserScore(userId){
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        if(!user.actualGame){
            throw new Error('User is not in a game.');
        }
        return user.actualGame.getUserScore()

    }
}