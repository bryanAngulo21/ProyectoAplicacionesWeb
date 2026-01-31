import {Router} from 'express'

import { actualizarPublicacion, eliminarPublicacion, detallePublicacion, listarPublicaciones, registrarPublicacion } from '../controllers/publicacion_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()


router.post("/publicacion/registro", verificarTokenJWT,registrarPublicacion)

router.get("/publicaciones",verificarTokenJWT,listarPublicaciones)

router.get("/publicacion/:id",verificarTokenJWT, detallePublicacion)

router.delete("/publicacion/eliminar/:id", verificarTokenJWT,eliminarPublicacion)

router.put("/publicacion/actualizar/:id", verificarTokenJWT,actualizarPublicacion)

export default router