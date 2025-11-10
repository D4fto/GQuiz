import { verify } from '../config/jwt.js';
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token não encontrado" });
  }

  try {
    const payload = verify(token);
    req.user = payload; // guarda o payload para uso nas rotas
    next(); // segue para a rota
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Token inválido" });
    }
    return res.status(400).json({ error: "Erro na requisição" });
  }
}
