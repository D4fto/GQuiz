import prisma from "../config/db.js"
import { sign } from "../config/jwt.js";

export async function getMyPoints(req, res) {
  const id = req.user.id
  try{
    const response = await prisma.user.findUnique({
      where: {
        id: id
      },
      
      select: {
        points: true,
        
      }
    })
    res.status(200).send({data: response})
  } catch (e) {
    res.status(400).send({error: e})
  }
}
export async function getUsers(req, res) {
  try{
    const response = await prisma.user.findMany({
      
      
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        points: true,
        isAdmin: true,
        id_userImg: true
      }
    })
    res.status(200).send({data: response})
  } catch (e) {
    res.status(400).send({error: e})
  }
}

export async function createUser(req, res) {
  const { data } = req.body
  try{
    console.log(data)
    const response = await prisma.user.create({
      data: data
    })
    res.status(200).send({data: response})
  } catch (e) {
    res.status(400).send({error: e})
  }
}

export async function deleteUser(req, res) {
  const id = parseInt(req.params.id)
  try{
    await prisma.user_has_level.deleteMany({
      where: {
        id_user: id
      }
    })
    const response = await prisma.user.delete({
      where: {
        id: id
      }
    })
    res.status(200).send({message: "Usuário deletado com sucesso", response: response})
  }catch(e){
    res.status(400).send({error: e})
  }
}

export async function updateUser(req, res) {
  const { data } = req.body
  const id = parseInt(req.params.id)
  try{
    const response = await prisma.user.update({
      where: {
        id: id
      },
      data: data
    })
    res.status(200).send({message: "Usuário atualizado com sucesso", response: response})
  }catch(e){
    res.status(400).send({error: e})
  }
}
export async function updateMyUser(req, res) {
  const  data  = req.body
  console.log(req.body)
  const id = req.user.id
  try{
    const response = await prisma.user.update({
      where: {
        id: id
      },
      data: data
    })
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        userImgs: {
          select: {
            imgName: true
          }
        }
      }
    });
    const { token, jwtExpirySeconds } = sign({
      id: user.id,
      email: user.email,
      username: user.username,
      imgName: user.userImgs.imgName,
      isAdmin: user.isAdmin,
    })

    res.cookie("token", token, { 
      maxAge: jwtExpirySeconds * 1000,
    })
      

    res.status(200).send({message: "Usuário atualizado com sucesso"})
  }catch(e){
    console.log(e)
    res.status(400).send({error: e})
  }
}

export async function getUserLevels(req,res) {
  const user = parseInt(req.params.user)
  const world = req.query.world || false
  
  try{
    const where = {
      id_user: user
    };

    if (world) {
      where.level = {
        id_world: parseInt(world)
      };
    }
    const response = await prisma.user_has_level.findMany({
      where,
      select: {
        id_user: true,
        id_level: true,
        max_points: true,
        level: {
          select: {
            id_world: true,
            number: true,
            label: true
          }
        }
      },
      orderBy: [
        { level: { id_world: 'asc' } },
        { level: { number: 'asc' } }
      ]
    })
    return res.status(200).send({data: response})
  }
  catch(e){
    return res.status(400).send({error: e})
  }
}

export async function addlevelsToUser(req,res) {
  const { levels } = req.body
  const user = parseInt(req.params.user)
  
  try{
    const data = []
    levels.map((e)=>{
      data.push({
        id_level: e,
        id_user: user
      })
    })
    const response = await prisma.user_has_level.createMany({
      data: data,
      skipDuplicates: true
    })
    return res.status(200).send({data: response, message: 'Levels adicionados com sucesso'})
  }
  catch(e){
    return res.status(400).send({error: e})
  }
}
export async function removeLevelsFromUser(req,res) {
  const { levels } = req.body
  const user = parseInt(req.params.user)
  
  try{
    const response = await prisma.user_has_level.deleteMany({
      where: {
        id_user: user,
        id_level : {
          in: levels
        }
      }
    })
    return res.status(200).send({data: response, message: 'Levels removidos com sucesso'})
  }
  catch(e){
    return res.status(400).send({error: e})
  }
}

