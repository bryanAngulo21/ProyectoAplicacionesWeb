import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema(
  {
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
      required: [true, "El proyecto es obligatorio"],
    },

    emisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estudiante",
      required: [true, "El emisor es obligatorio"],
    },

    contenido: {
      type: String,
      required: [true, "El mensaje no puede estar vacío"],
      trim: true,
      maxlength: [500, "El mensaje no puede superar los 500 caracteres"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Mensaje", mensajeSchema);
