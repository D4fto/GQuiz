import prisma from "../config/db.js";

export async function getWorlds(req, res){
    const worlds = await prisma.world.findMany()
  res.send({data: worlds})
};
