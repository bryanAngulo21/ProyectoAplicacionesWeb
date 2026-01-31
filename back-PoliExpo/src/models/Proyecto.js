import { Schema, model } from 'mongoose';

const proyectoSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  categoria: {
    type: String,
    enum: ['academico', 'extracurricular'],
    required: true,
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: 'Estudiante',
    required: true,
  },
  colaboradores: [{
    type: Schema.Types.ObjectId,
    ref: 'Estudiante',
  }],
  carrera: {
    type: String,
    required: true,
  },
  nivel: {
    type: Number,
    min: 1,
    max: 6,
  },
  imagenes: [{
    url: String,
    publicId: String,
  }],
  tecnologias: [String],
  fechaInicio: {
    type: Date,
    required: true,
  },
  fechaFin: Date,
  estado: {
    type: String,
    enum: ['en_proceso', 'finalizado', 'publicado'],
    default: 'en_proceso',
  },
  publico: {
    type: Boolean,
    default: true,
  },
  vistas: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Estudiante',
  }],
  comentarios: [{
    estudiante: {
      type: Schema.Types.ObjectId,
      ref: 'Estudiante',
    },
    texto: String,
    fecha: {
      type: Date,
      default: Date.now,
    },
  }],

  // ✅ CORRECCIÓN IMPORTANTE
  totalDonaciones: {
    type: Number,
    default: 0,
  },

}, {
  timestamps: true,
});

proyectoSchema.index({ titulo: 'text', descripcion: 'text' });

proyectoSchema.methods.incrementarVistas = async function () {
  this.vistas += 1;
  return await this.save();
};

proyectoSchema.methods.agregarLike = async function (estudianteId) {
  if (!this.likes.includes(estudianteId)) {
    this.likes.push(estudianteId);
    return await this.save();
  }
  return this;
};

export default model('Proyecto', proyectoSchema);
