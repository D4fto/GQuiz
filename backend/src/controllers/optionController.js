import prisma from "../config/db.js";

export async function upateManyOptions(req,res) {
  const { data } = req.body;
  try{
    for (const element of data) {
      await prisma.option.update({
        where: {
          id: element.id
        },
        data: {
          label: element.label,
          isCorrect: element.isCorrect,
          id_question: element.id_question
        }
      })
    }
    return res.status(200).send({message: 'Opções atualizadas com sucesso'})
  }catch(e){
    return res.status(400).send({error: e})
  }
}