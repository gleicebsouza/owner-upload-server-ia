import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function getAllPromptsRoute(app: FastifyInstance) {
  //routes list prompts
  app.get('/prompts', async () => {
    const prompts = await prisma.prompt.findMany({})
    
    return prompts
  })
}
//rota funciona
