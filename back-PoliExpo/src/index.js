/*import app from './server.js'
import connection from './database.js';

connection()

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})*/

import app from './server.js'
import connection from './database.js'
import http from 'http'
import { Server } from 'socket.io'


connection()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? ["https://poli-expo.netlify.app", "https://poliexpoback.onrender.com"]
            : "http://localhost:5173",
        credentials: true
    }
})



io.on('connection', (socket) => {
    console.log('Usuario conectado',socket.id)
    socket.on('enviar-mensaje-front-back',(payload)=>{
        socket.broadcast.emit('enviar-mensaje-front-back',payload)
    })
})



server.listen(process.env.PORT || app.get('port'), () => {
    console.log(`Server running on port ${process.env.PORT || app.get('port')}`);
})