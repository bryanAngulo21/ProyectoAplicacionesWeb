import { Router } from 'express';
import { donarProyecto } from '../controllers/donacion_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

/* =========================
   DONACIONES
========================= */

// Registrar donación a un proyecto
router.post('/donacion/registrar', verificarTokenJWT, donarProyecto);

export default router;
