import {Router} from 'express'
import { comprobarTokenPasword, confirmarMail, crearNuevoPassword, recuperarPassword, registro, login, getUnsplashImage, fetchQuoteController} from '../controllers/veterinario_controller.js'

const router = Router()


router.post('/registro',registro)
router.get('/confirmar/:token',confirmarMail)

router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPasword)
router.post('/nuevopassword/:token',crearNuevoPassword)
router.post('/veterinario/login',login) 
router.get("/random-image", getUnsplashImage);
router.get("/frases", fetchQuoteController);

export default router