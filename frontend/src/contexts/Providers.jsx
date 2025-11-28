import { AuthProvider } from "./authContext";
import { GameProvider } from "./gameContext";

export function Providers({ children }) {
  return (
    <GameProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </GameProvider>
  );
}
