import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './database.js';

// Routers
import routerEstudiantes from './routers/estudiante_routers.js';
import routerReconocimiento from './routers/reconocimiento_routers.js';

dotenv.config();

const app = express();

// Conectar a MongoDB
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Puerto
const PORT = process.env.PORT || 3000;

// Ruta principal
app.get('/', (req, res) => res.send("Server on"));

// Rutas API
app.use('/api/estudiantes', routerEstudiantes);
app.use('/api/reconocimiento', routerReconocimiento);

// Ruta no encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Levantar servidor
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
