// socket.js
import { io } from "socket.io-client";


export const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
});

export function connectSocket() {
  socket.connect();
}

socket.on("connect_error", (err) => {
  console.error(err)
});

connectSocket()