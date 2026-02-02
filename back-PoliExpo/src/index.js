import 'dotenv/config'
import app from './server.js'
import connection from './database.js'
import http from 'http'
import { Server } from 'socket.io'

connection()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      process.env.URL_FRONTEND,
      'http://localhost:5173'
    ],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true
})

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id)

  socket.on('enviar-mensaje-front-back', (payload) => {
    socket.broadcast.emit('enviar-mensaje-front-back', payload)
  })
})

server.listen(app.get('port'), () => {
  console.log(`🚀 Server ON en puerto ${app.get('port')}`)
})
