import { fastify } from 'fastify'

const app = fastify()

app.get('/', () => {
  return 'hello, agora é o backend aqui !!'
})

app
  .listen({
    port: 3333
  })
  .then(() => {
    console.log('HTTP Server Running !')
  })


/* Rotas
* 
* Upload de vídeos
* Transcrição
* Gerar as informações do vídeo. Conteúdo: título,descrição do vídeo.
 */