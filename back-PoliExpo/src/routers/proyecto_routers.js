import { Router } from 'express';
import {
  listarProyectos,
  crearProyecto,
  obtenerProyecto,
  actualizarProyecto,
  eliminarProyecto,
  agregarLike,
  agregarComentario,
  quitarLike,
  buscarProyectos,
  proyectosDestacados,
  proyectosPorCategoria,
  proyectosPorCarrera
} from '../controllers/proyecto_controller.js';

import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

/* =========================
   RUTAS PÚBLICAS
========================= */

// Listar todos los proyectos
router.get('/proyectos', listarProyectos);

// Buscar proyectos
router.get('/proyectos/buscar', buscarProyectos);

// Proyectos destacados
router.get('/proyectos/destacados', proyectosDestacados);

// Proyectos por categoría
router.get('/proyectos/categoria/:categoria', proyectosPorCategoria);

// Proyectos por carrera
router.get('/proyectos/carrera/:carrera', proyectosPorCarrera);

// Detalle de proyecto
router.get('/proyecto/:id', obtenerProyecto);

/* =========================
   RUTAS PROTEGIDAS
========================= */

// Crear proyecto
router.post('/proyecto/registro', verificarTokenJWT, crearProyecto);

// Actualizar proyecto
router.put('/proyecto/actualizar/:id', verificarTokenJWT, actualizarProyecto);

// Eliminar proyecto
router.delete('/proyecto/eliminar/:id', verificarTokenJWT, eliminarProyecto);

// Like a proyecto
router.post('/proyecto/like/:id', verificarTokenJWT, agregarLike);

// Quitar like
router.delete('/proyecto/like/:id', verificarTokenJWT, quitarLike);

// Comentarios
router.post('/proyecto/comentario/:id', verificarTokenJWT, agregarComentario);

export default router;