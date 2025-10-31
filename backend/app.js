import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // your frontend address
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  io.emit('message', 'Olá mundo ' + socket.id)

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));