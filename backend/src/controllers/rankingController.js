import prisma from "../config/db.js"


export async function getRanking(req, res){
  const limit = req.params.limit 
  try{
    const query = {
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
    }
    if(limit){
      query.take = parseInt(limit)
    }
    const response = await prisma.user.findMany(query)
    
    res.send({response: response.map((e,i)=>{
      e.position = i+1
      return e
    })})
  }catch(e){
    res.status(400).send({error: e})
  }
}