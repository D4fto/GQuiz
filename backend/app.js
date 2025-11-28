import { app, server } from './src/config/server.js';
import { io } from './src/config/io.js';
import prisma from './src/config/db.js';
import loginRouter from './src/routes/login.routes.js'
import rankingRouter from './src/routes/ranking.routes.js'
import { verify } from './src/config/jwt.js';
import worldRouter from './src/routes/world.routes.js'
import categoryRouter from './src/routes/category.routes.js'
import questionRouter from './src/routes/question.routes.js'
import levelRouter from './src/routes/level.routes.js'
import userRouter from './src/routes/user.routes.js'
import optionRouter from './src/routes/option.routes.js'
import gameRouter from './src/routes/game.routes.js'
import userImgs from './src/routes/userImgs.route.js'


import * as dotenv from "dotenv";
dotenv.config();



app.use('/login', loginRouter)
app.use('/ranking', rankingRouter)
app.use('/world', worldRouter)
app.use('/category', categoryRouter)
app.use('/question', questionRouter)
app.use('/level', levelRouter)
app.use('/user', userRouter)
app.use('/option', optionRouter)
app.use('/game', gameRouter)
app.use('/user-imgs', userImgs)

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

// async function main() {
//   const users = await prisma.user.findMany();
//   console.log(users);
// }

// main();




const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));