import dotenv from 'dotenv';
import path from 'path';

// ⚡ Esto debe ir primero, antes de cualquier import que use process.env
dotenv.config({ path: path.resolve('./.env') });



import { getRandomImage } from './services/imagenFondo.js';
import app from './server.js';
import connection from './database.js';

console.log("🚀 Iniciando SmartVet API...");

// Conexión a la base de datos
connection();

// Iniciar el servidor
app.listen(app.get('port'), () => {
  console.log(`Server ok on http://localhost:${app.get('port')}`);
});
