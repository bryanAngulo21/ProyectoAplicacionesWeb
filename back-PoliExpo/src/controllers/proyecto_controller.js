import Proyecto from '../models/Proyecto.js';
import mongoose from 'mongoose';

/**
 * Listar todos los proyectos
 * Público
 */
const listarProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find()
      .populate('autor', 'nombre email')
      .sort({ createdAt: -1 });

    res.status(200).json(proyectos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al listar proyectos' });
  }
};

/**
 * Crear un nuevo proyecto
 * Protegido
 */
const crearProyecto = async (req, res) => {
  try {
    const proyecto = new Proyecto(req.body);
    proyecto.autor = req.estudianteHeader._id;

    await proyecto.save();
    res.status(201).json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'No se pudo crear el proyecto' });
  }
};

/**
 * Obtener un proyecto por ID
 * Público
 */
const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID no válido' });
  }

  try {
    const proyecto = await Proyecto.findById(id)
      .populate('autor', 'nombre email');

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al obtener proyecto' });
  }
};

/**
 * Actualizar proyecto
 * Protegido - solo autor
 */
const actualizarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    if (proyecto.autor.toString() !== req.estudianteHeader._id.toString()) {
      return res.status(403).json({ msg: 'Acción no permitida' });
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.categoria = req.body.categoria || proyecto.categoria;

    await proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al actualizar proyecto' });
  }
};

/**
 * Eliminar proyecto
 * Protegido - solo autor
 */
const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    if (proyecto.autor.toString() !== req.estudianteHeader._id.toString()) {
      return res.status(403).json({ msg: 'Acción no permitida' });
    }

    await proyecto.deleteOne();
    res.json({ msg: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al eliminar proyecto' });
  }
};

/**
 * Agregar like a un proyecto
 * Protegido
 */
const agregarLike = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    if (proyecto.likes.includes(req.estudianteHeader._id)) {
      return res.status(400).json({ msg: 'Ya diste like a este proyecto' });
    }

    proyecto.likes.push(req.estudianteHeader._id);
    await proyecto.save();

    res.json({ likes: proyecto.likes.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al dar like' });
  }
};

/**
 * Agregar comentario
 * Protegido
 */
const agregarComentario = async (req, res) => {
  const { id } = req.params;
  const { comentario } = req.body;

  if (!comentario) {
    return res.status(400).json({ msg: 'El comentario es obligatorio' });
  }

  try {
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    proyecto.comentarios.push({
      autor: req.estudianteHeader._id,
      comentario
    });

    await proyecto.save();
    res.status(201).json(proyecto.comentarios);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al agregar comentario' });
  }
};

export {
  listarProyectos,
  crearProyecto,
  obtenerProyecto,
  actualizarProyecto,
  eliminarProyecto,
  agregarLike,
  agregarComentario
};
