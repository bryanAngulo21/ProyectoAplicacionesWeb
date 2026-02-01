import { Router } from 'express';
import { sugerirTitulos } from '../controllers/ia_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';

const router = Router();

// Solo usuarios autenticados pueden pedir sugerencias
router.post('/sugerir-titulos', verificarTokenJWT, sugerirTitulos);

export default router;