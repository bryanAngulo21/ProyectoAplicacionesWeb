import { Router } from 'express';
import {
  listarProyectos,
  crearProyecto,
  obtenerProyecto,
  actualizarProyecto,
  eliminarProyecto,
  agregarLike,
  agregarComentario
} from '../controllers/proyecto_controller.js';

import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

/* =========================
   PROYECTOS
========================= */

// Crear proyecto
router.post(
  '/proyecto/registro',
  verificarTokenJWT,
  crearProyecto
);

// Listar proyectos
router.get(
  '/proyectos',
  listarProyectos
);

// Detalle de proyecto
router.get(
  '/proyecto/:id',
  obtenerProyecto
);

// Actualizar proyecto
router.put(
  '/proyecto/actualizar/:id',
  verificarTokenJWT,
  actualizarProyecto
);

// Eliminar proyecto
router.delete(
  '/proyecto/eliminar/:id',
  verificarTokenJWT,
  eliminarProyecto
);

// Like
router.post(
  '/proyecto/like/:id',
  verificarTokenJWT,
  agregarLike
);

// Comentarios
router.post(
  '/proyecto/comentario/:id',
  verificarTokenJWT,
  agregarComentario
);

export default router;
