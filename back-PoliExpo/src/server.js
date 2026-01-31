// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';

import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"


// Inicializaciones
const app = express()
dotenv.config()


// Configuraciones 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// Middlewares 
app.use(express.json())
app.use(cors())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))


// Variables globales Puerto
app.set('port',process.env.PORT || 3000)



// Rutas 
app.get('/',(req,res)=> res.send("Server on"))

// Agregar las rutas de estudiantes
import routerEstudiantes from './routers/estudiante_routers.js'
import routerPublicacion from './routers/publicacion_routes.js'


// Rutas para estudiantes
app.use('/api',routerEstudiantes)
// Rutas para publicaciones
app.use('/api',routerPublicacion)

//Rutas Api
import routerReconocimiento from './routers/reconocimiento_routers.js'
app.use('/api', routerReconocimiento)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Importar la conexión a la base de datos
import connection from './database.js';
// Conectar a MongoDB
connection();

// Exportar la instancia de express por medio de app
export default  app

