import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import * as dotenv from "dotenv";
dotenv.config();

export const app = express();
app.use(cors({
  origin: process.env.FRONT_URL,
  credentials: true,
  allowedHeaders:['Content-Type']
}));

app.use(bodyParser.json());
app.use(cookieParser()); 

export const server = http.createServer(app);