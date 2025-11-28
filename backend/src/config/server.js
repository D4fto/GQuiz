import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

export const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders:['Content-Type']
}));

app.use(bodyParser.json());
app.use(cookieParser()); 

export const server = http.createServer(app);