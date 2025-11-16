import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI_PRODUCTION;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas correctamente");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });
