// socket.js
import { io } from "socket.io-client";


export const socket = io(import.meta.env.VITE_API_URL, {
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