import prisma from "../config/db.js";

export async function getWorlds(req, res){
  const worlds = await prisma.world.findMany({
    orderBy: {
      id: 'asc'
    }
  })
  res.send({data: worlds})
};

export async function createWorld(req, res) {
  const { name, icon } = req.body

  try{
    const response = await prisma.world.create({
      data: {
        name: name,
        icon: icon
      }
    })
    res.status(200).send({message: "Mundo criado com sucesso", response: response})
  }catch(e){
    res.status(400).send({error: e})
  }
}

export async function editWorld(req, res) {
  const { data } = req.body
  const id = parseInt(req.params.id)
  try{
    const response = await prisma.world.update({
      where: {
        id: id
      },
      data: data
    })
    res.status(200).send({message: "Mundo atualizado com sucesso", response: response})
  }catch(e){
    res.status(400).send({error: e})
  }
}


export async function deleteWorld(req, res) {
  const id = parseInt(req.params.id)
  try{
    await prisma.level.updateMany({
      where: {
        id_world: id
      },
      data: {
        id_world: 1
      }

    })
    const response = await prisma.world.delete({
      where: {
        id: id
      }
    })
    res.status(200).send({message: "Mundo deletado com sucesso", response: response})
  }catch(e){
    res.status(400).send({error: e})
  }
}

export async function myProgress(req,res) {
  try{
    const worlds = await prisma.world.findMany({
      select: {
        id: true,
        name: true,
        level: {
          select: {
            level_has_question: {
              select: {
                question: {
                  select: {
                    weight: true
                  }
                }
              }
            }
          }
        }
      }
    })

    worlds.map((e)=>{
      let sum = 0
      e.level.map(y=>{
        y.level_has_question.map((x)=>{
          sum+=x.question.weight
        })
      })
      e.total=sum
      delete e.level
    })



    const my = await prisma.$queryRaw`
      SELECT l.id_world, SUM(uhl.max_points) as total_points
      FROM user_has_level uhl
      JOIN level l ON l.id = uhl.id_level
      WHERE uhl.id_user = ${req.user.id}
      GROUP BY l.id_world
    `;

    const fixed = my.map(row => ({
      ...row,
      total_points: Number(row.total_points)
    }));

    const data = worlds.map((e)=>{
      const myStatus = fixed.find(x=>x.id_world===e.id)
      if(myStatus){
        return [e.name,Math.round(myStatus.total_points/e.total*100,2)]
      }
      return [e.name, 0]
    })

    data.unshift(['mundo', 'progresso %'])

    


    res.send({data: data })
  }catch(e){
    console.error(e)
  }
}