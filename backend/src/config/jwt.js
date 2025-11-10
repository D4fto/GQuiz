import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const jwtKey = process.env.JWT_SECRET
const jwtExpirySeconds = 60 * 60 * 24 * 7

export function sign(payload){
  return { 
    token: jwt.sign(payload, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    }),
    jwtExpirySeconds: jwtExpirySeconds
  }
}

export function verify(token){
  return jwt.verify(token, jwtKey)
}

