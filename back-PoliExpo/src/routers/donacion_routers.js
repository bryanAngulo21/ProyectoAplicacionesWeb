import { Router } from "express";
import { 
  donarPlataforma, 
  obtenerDonacionesEstudiante,
  obtenerTodasDonaciones 
} from "../controllers/donacion_controller.js";
import { verificarTokenJWT, verificarAdmin } from "../middlewares/JWT.js";

const router = Router();

/* =========================
   DONACIONES A LA PLATAFORMA
========================= */

// Donar a la plataforma
router.post("/donacion/registrar", verificarTokenJWT, donarPlataforma);

// Obtener donaciones del estudiante logueado
router.get("/donaciones/mis-donaciones", verificarTokenJWT, obtenerDonacionesEstudiante);

/* =========================
   RUTAS DE ADMINISTRADOR
========================= */

// Obtener TODAS las donaciones (solo admin)
router.get("/donaciones/todas", verificarTokenJWT, verificarAdmin, obtenerTodasDonaciones);

export default router;