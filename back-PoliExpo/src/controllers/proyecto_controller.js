import Proyecto from '../models/Proyecto.js';
import mongoose from 'mongoose';

// FUNCIONES ORIGINALES
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

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID no válido' });
  }

  try {
    const proyecto = await Proyecto.findById(id)
      .populate('autor', 'nombre email')
      .populate('colaboradores', 'nombre email')
      .populate('comentarios.estudiante', 'nombre apellido');

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // Incrementar vistas
    await proyecto.incrementarVistas();

    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al obtener proyecto' });
  }
};

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

    // Actualizar TODOS los campos que vienen del frontend
    if (req.body.titulo !== undefined) proyecto.titulo = req.body.titulo;
    if (req.body.descripcion !== undefined) proyecto.descripcion = req.body.descripcion;
    if (req.body.categoria !== undefined) proyecto.categoria = req.body.categoria;
    if (req.body.carrera !== undefined) proyecto.carrera = req.body.carrera;
    if (req.body.nivel !== undefined) proyecto.nivel = req.body.nivel;
    if (req.body.estado !== undefined) proyecto.estado = req.body.estado;
    if (req.body.publico !== undefined) proyecto.publico = req.body.publico;
    if (req.body.asignatura !== undefined) proyecto.asignatura = req.body.asignatura;
    if (req.body.repositorio !== undefined) proyecto.repositorio = req.body.repositorio;
    if (req.body.enlaceDemo !== undefined) proyecto.enlaceDemo = req.body.enlaceDemo;
    
    // Manejar fecha de inicio
    if (req.body.fechaInicio !== undefined) {
      proyecto.fechaInicio = new Date(req.body.fechaInicio);
    }
    
    // Manejar tecnologías
    if (req.body.tecnologias !== undefined) {
      proyecto.tecnologias = req.body.tecnologias;
    }
    
    // Manejar docente
    if (req.body.docente !== undefined) {
      proyecto.docente = req.body.docente;
    }

    await proyecto.save();
    
    // Popular el autor para devolver datos completos
    await proyecto.populate('autor', 'nombre email');
    
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al actualizar proyecto' });
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // Permitir al autor O a un admin eliminar
    if (proyecto.autor.toString() !== req.estudianteHeader._id.toString() && 
        req.estudianteHeader.rol !== 'admin') {
      return res.status(403).json({ msg: 'Acción no permitida' });
    }

    await proyecto.deleteOne();
    res.json({ msg: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al eliminar proyecto' });
  }
};

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
      estudiante: req.estudianteHeader._id,
      texto: comentario
    });

    await proyecto.save();
    res.status(201).json(proyecto.comentarios);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al agregar comentario' });
  }
};

// FUNCIONES NUEVAS 
const quitarLike = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    const index = proyecto.likes.indexOf(req.estudianteHeader._id);
    if (index === -1) {
      return res.status(400).json({ msg: 'No has dado like a este proyecto' });
    }

    proyecto.likes.splice(index, 1);
    await proyecto.save();

    res.json({ likes: proyecto.likes.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al quitar like' });
  }
};

const buscarProyectos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ msg: 'Debe proporcionar un término de búsqueda' });
    }

    const proyectos = await Proyecto.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .populate('autor', 'nombre email')
      .sort({ score: { $meta: "textScore" } })
      .limit(20);

    res.json(proyectos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al buscar proyectos' });
  }
};

const proyectosDestacados = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ estado: 'publicado' })
      .populate('autor', 'nombre email')
      .sort({ vistas: -1 })
      .limit(6);

    res.json(proyectos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al obtener proyectos destacados' });
  }
};

const proyectosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    
    if (!['academico', 'extracurricular'].includes(categoria)) {
      return res.status(400).json({ msg: 'Categoría no válida' });
    }

    const proyectos = await Proyecto.find({ categoria, estado: 'publicado' })
      .populate('autor', 'nombre email')
      .sort({ createdAt: -1 });

    res.json(proyectos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al obtener proyectos por categoría' });
  }
};

const proyectosPorCarrera = async (req, res) => {
  try {
    const { carrera } = req.params;
    
    const proyectos = await Proyecto.find({ carrera, estado: 'publicado' })
      .populate('autor', 'nombre email')
      .sort({ createdAt: -1 });

    res.json(proyectos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al obtener proyectos por carrera' });
  }
};

export {
  listarProyectos,
  crearProyecto,
  obtenerProyecto,
  actualizarProyecto,
  eliminarProyecto,
  agregarLike,
  agregarComentario,
  // Nuevas funciones
  quitarLike,
  buscarProyectos,
  proyectosDestacados,
  proyectosPorCategoria,
  proyectosPorCarrera
};