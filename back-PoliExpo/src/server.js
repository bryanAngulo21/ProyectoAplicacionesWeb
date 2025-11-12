// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';

import routerEstudiantes from './routers/estudiante_routers.js'

// Inicializaciones
const app = express()
dotenv.config()


// Configuraciones 



// Middlewares 
app.use(express.json())
app.use(cors())



// Variables globales
app.set('port',process.env.PORT || 3000)



// Rutas 
app.get('/',(req,res)=> res.send("Server on"))

// Ruta principal
app.get('/',(req,res)=>res.send("Server on"))

// Rutas para estudiantes
app.use('/api',routerEstudiantes)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


// Exportar la instancia de express por medio de app
export default  app