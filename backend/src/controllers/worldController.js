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
    await prisma.world_has_level.deleteMany({
      where: {
        id_level: id
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
