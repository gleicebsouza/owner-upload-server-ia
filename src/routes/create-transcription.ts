import { FastifyInstance } from 'fastify'
import { createReadStream } from 'node:fs'
import { z } from 'zod'
import { openai } from '../lib/openai'
import { prisma } from '../lib/prisma'

// route transcription , use lib zod for validation
export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post('/videos/:videoId/transcription', async req => {
    const paramsSchema = z.object({
      //validation zod
      videoId: z.string().uuid() //video string
    })

    const { videoId } = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      // body requisition
      prompt: z.string()
    })

    const { prompt } = bodySchema.parse(req.body)
    //method path video
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      }
    })

    const videoPath = video.path
    const audioReadStream = createReadStream(videoPath)

    const response = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt
    })

    const transcription = response.text

    await prisma.video.update({
      where: {
        id: videoId
      },
      data: {
        transcription
      }
    })

    return {
      transcription
    }
  })
}

//erro: arquivo não suportado
