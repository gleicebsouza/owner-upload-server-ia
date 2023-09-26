import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import { getAllPromptsRoute } from './routes/get-all-prompts'
import { uploadVideoRoute } from './routes/upload-video'
import { createTranscriptionRoute } from './routes/create-transcription'
import { generateAICompletionRoute } from './routes/generate-ai-completion'

const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompletionRoute)

// return Promise

app
  .listen({
    port: 3333
  })
  .then(() => {
    console.log(' Hello!!! HTTP Server Running here!')
  })

/* Rotas
 * Upload de vídeos
 * Transcrição
 * Gerar as informações do vídeo. Conteúdo: título,descrição do vídeo.
 */
