import { Router } from "express";
import {
  enviarMensaje,
  listarMensajesProyecto,
} from "../controllers/mensaje_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router();

/* =========================
   MENSAJES POR PROYECTO
========================= */

// Listar mensajes de un proyecto
router.get("/:proyectoId", verificarTokenJWT, listarMensajesProyecto);

// Enviar mensaje a un proyecto
router.post("/:proyectoId", verificarTokenJWT, enviarMensaje);

export default router;
