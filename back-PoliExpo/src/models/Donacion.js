import mongoose from "mongoose";

const donacionSchema = new mongoose.Schema(
  {
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },

    // Puede ser null si la donación es anónima
    donante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estudiante",
      default: null,
    },

    monto: {
      type: Number,
      required: true,
      min: [1, "El monto mínimo de donación es 1"],
    },

    mensaje: {
      type: String,
      trim: true,
      maxlength: [300, "El mensaje no puede superar los 300 caracteres"],
      default: "",
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true, // evita pagos duplicados
    },

    estado: {
      type: String,
      enum: ["exitosa", "fallida"],
      default: "exitosa",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Donacion", donacionSchema);
