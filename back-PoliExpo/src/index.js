import 'dotenv/config'
import app from './server.js'
import connection from './database.js'
import http from 'http'
import { Server } from 'socket.io'

connection()

const server = http.createServer(app)

// 🌍 Orígenes permitidos
const allowedOrigins = [
  process.env.URL_FRONTEND,     // producción (Render)
  'http://localhost:5173'       // desarrollo local
].filter(Boolean) // elimina undefined

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // permitir Postman / server-to-server
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS bloqueado: ${origin}`), false)
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
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
