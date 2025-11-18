import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import prisma from './src/config/db.js';
import loginRouter from './src/routes/login.routes.js'
import rankingRouter from './src/routes/ranking.routes.js'
import { verify } from './src/config/jwt.js';
import worldRouter from './src/routes/world.routes.js'
import categoryRouter from './src/routes/category.routes.js'
import questionRouter from './src/routes/question.routes.js'
import levelRouter from './src/routes/level.routes.js'
import userRouter from './src/routes/user.routes.js'

import * as dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders:['Content-Type']
}));
const server = http.createServer(app);

app.use(bodyParser.json())
app.use(cookieParser())
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend address
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type']
  }
});


app.use('/login', loginRouter)
app.use('/ranking', rankingRouter)
app.use('/world', worldRouter)
app.use('/category', categoryRouter)
app.use('/question', questionRouter)
app.use('/level', levelRouter)
app.use('/user', userRouter)

app.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).end();

  try {
    const payload = verify(token)
    res.json({ id: payload.id, email: payload.email, username: payload.username});
  } catch {
    res.status(401).end();
  }
});

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main();


io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  io.emit('message', 'Olá mundo ' + socket.id)

  socket.on('noo', () => {
    console.log('user noooooooooo:', socket.id);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));