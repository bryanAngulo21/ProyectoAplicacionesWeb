import { Router } from 'express';
import { dashboardAdmin, dashboardEstudiante } from '../controllers/dashboard_controller.js';
import { verificarTokenJWT, verificarAdmin } from '../middlewares/JWT.js';

const router = Router();

// Dashboard para admin (solo administradores)
router.get('/admin', verificarTokenJWT, verificarAdmin, dashboardAdmin);

// Dashboard para estudiante (cualquier usuario logueado)
router.get('/estudiante', verificarTokenJWT, dashboardEstudiante);

export default router;