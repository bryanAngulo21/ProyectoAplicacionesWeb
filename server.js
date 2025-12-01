// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";       // ✅ Importar mongoose
import connection from "./database.js"; // si usás esta función para conectar
import routerVeterinarios from "./src/routes/veterinario_routes.js";
import dotenv from "dotenv";           // si usás variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE"],
  })
);

// — Conectar a la base de datos ANTES de iniciar el servidor —
async function startServer() {
  try {
    // ↪️ Aquí conectamos a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      // estas opciones ayudan a compatibilidad
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Base de datos conectada");

    // Puerto para Render
    const PORT = process.env.PORT || 10000;
    app.set("port", PORT);

    // Rutas
    app.get("/", (req, res) => {
      res.send("API funcionando desde Render");
    });
    app.use("/api", routerVeterinarios);

    // 404
    app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

    // Iniciar server
    app.listen(PORT, () => {
      console.log(`🚀 Servidor listo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("⛔ Error conectando a la base de datos:", err);
  }
}

startServer();

