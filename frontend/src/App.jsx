import { useState, useEffect } from 'react';
import { socket } from './services/socket';
export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessage(message) {
      console.log(message)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);
    
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
    };
  }, []);

  return (
    <div className="App">
    </div>
  );
}