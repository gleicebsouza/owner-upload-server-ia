import { FastifyInstance } from 'fastify'
import { fastifyMultipart } from '@fastify/multipart'
import { prisma } from '../lib/prisma'
import path from 'node:path'
import fs from 'node:fs'
import { pipeline } from 'node:stream'
import { randomUUID } from 'node:crypto'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

/* modules internos node: path,fs,crypto,http,util,stream
	Promisify, permite usar apis antigas do node(Callback), e async e await
 */
export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25 //25mb
      /** 1_048_576 /1024 = 1megabit */
    }
  })

  // create  route upload video
  app.post('/videos', async (request, reply) => {
    const data = await request.file()

    if (!data) {
      //exception error
      return reply.status(400).send({ error: 'Missing file input.' })
    }
    const extension = path.extname(data.filename)

    // upload files
    if (extension !== '.mp3') {
      return reply
        .status(400)
        .send({ error: 'Invalid input type,please upload a MP3.' })
    }
    // não salvar arquivos com o mesmo nome

    const fileBaseName = path.basename(data.filename, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    // caminho que salvei o upload
    const uploadDestination = path.resolve(
      __dirname,
      '../../tmp',
      fileUploadName
    )
    await pump(data.file, fs.createWriteStream(uploadDestination))

    // criar registro com o arquivo que fiz upload
    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      }
    })
    /* == retorno vazio ===
    return reply.send() */

    return {
      video
    }
  })
}

/*  rota funciona
ERROR UPLOAD VIDEOS
{
	"statusCode": 406,
	"code": "FST_INVALID_MULTIPART_CONTENT_TYPE",
	"error": "Not Acceptable",
	"message": "the request is not multipart"
}

{
	"message": "Route GET:/videos not found",
	"error": "Not Found",
	"statusCode": 404
}

 */
