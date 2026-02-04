// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';

import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"

import session from 'express-session';
import passport from './config/passport.js';

// Inicializaciones
const app = express()
dotenv.config()


// Configuraciones 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
//conecion chat
app.set('trust proxy', 1)

// Middlewares 
app.use(express.json())
app.use(cors())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))


// Configuración de sesiones para OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret_session_poliexpo',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());


// Variables globales Puerto
app.set('port',process.env.PORT || 3000)



// Rutas 
app.get('/',(req,res)=> res.send("SERVER ON - API de PoliExpo - Sistema de Gestión de Proyectos Académicos"))


// Importar rutas
import routerEstudiantes from './routers/estudiante_routers.js'
import routerPublicacion from './routers/publicacion_routers.js'
import routerProyectos from './routers/proyecto_routers.js'
import routerMensajes from './routers/mensaje_routers.js'
import routerDonaciones from './routers/donacion_routers.js'
import routerReconocimiento from './routers/reconocimiento_routers.js'

// NUEVAS RUTAS
import routerDashboard from './routers/dashboard_routers.js'
import routerIA from './routers/ia_routers.js'

// Rutas 
app.use('/api', routerEstudiantes)
app.use('/api', routerPublicacion)
app.use('/api', routerProyectos)
app.use('/api', routerMensajes)
app.use('/api', routerDonaciones)
app.use('/api', routerReconocimiento)

// Usar NUEVAS rutas
app.use('/api/dashboard', routerDashboard)
app.use('/api/ia', routerIA)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=> res.status(404).json({
  success: false,
  message: "Endpoint no encontrado - 404"
}))

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err.message);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Importar la conexión a la base de datos
import connection from './database.js';
// Conectar a MongoDB
connection();

// Exportar la instancia de express por medio de app
export default  app

import cors from 'cors';

// Configuración de CORS dinámica
const corsOptions = {
  origin: function (origin, callback) {
    // En desarrollo, permitir cualquier origen
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // En producción, solo orígenes específicos
    const allowedOrigins = [
      'https://poli-expo.netlify.app',
      'https://poliexpoback.onrender.com',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Manejar preflight OPTIONS requests
app.options('*', cors(corsOptions));