import prisma from "../config/db.js"


export async function getRanking(req, res){
  const limit = req.params.limit || 10
  try{
    const response = await prisma.user.findMany({
      take: parseInt(limit),
      where: {
        isAdmin: false
      },
      orderBy: {
        points: 'desc'
      },
      select:{
        username: true,
        points: true,
        userImgs: {
          select: {
            imgName: true
          }
        }
      }
    })
    res.send({response})
  }catch(e){
    res.status(400).send({error: e})
  }
}