import { Schema, model } from 'mongoose';

const proyectoSchema = new Schema({
  // CAMPOS ORIGINALES
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
  totalDonaciones: {
    type: Number,
    default: 0,
  },
  docente: {  // ← YA LO TIENES
    nombre: String,
    email: String,
  },

  // SOLO AGREGAR ESTOS CAMPOS NUEVOS:
  asignatura: {  // ← NUEVO del compañero
    type: String,
    trim: true,
  },
  imagenesID: [{  // ← para Cloudinary
    type: String,
  }],
  documentos: [{
    nombre: String,
    url: String,
    tipo: String,
  }],
  repositorio: {
    type: String,
    trim: true,
  },
  enlaceDemo: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],

}, {
  timestamps: true,
});

// Índices para búsqueda
proyectoSchema.index({ titulo: 'text', descripcion: 'text', tags: 'text' });
proyectoSchema.index({ categoria: 1, estado: 1 });
proyectoSchema.index({ autor: 1 });
proyectoSchema.index({ carrera: 1 });

// Métodos
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

proyectoSchema.methods.quitarLike = async function(estudianteId) {
  const index = this.likes.indexOf(estudianteId);
  if (index !== -1) {
    this.likes.splice(index, 1);
    await this.save();
  }
  return this;
};

export default model('Proyecto', proyectoSchema);