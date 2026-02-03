import {Router} from 'express'
import { 
  actualizarPassword, 
  actualizarPerfil,
  comprobarTokenPasword, 
  confirmarMail, 
  crearNuevoPassword, 
  login, 
  perfil, 
  recuperarPassword, 
  registro,
  googleCallback  ,
  listarTodosUsuarios,  
  verDetallesUsuario,
  eliminarUsuario
} from '../controllers/estudiante_controller.js'
import { verificarTokenJWT, verificarAdmin }from '../middlewares/JWT.js'
import passport from 'passport'

const router = Router()

// ===== RUTAS PÚBLICAS =====

// Registro tradicional
router.post('/registro', registro)

// Confirmación de email
router.get('/confirmar/:token', confirmarMail)

// Recuperación de contraseña
router.post('/recuperarpassword', recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPasword)
router.post('/nuevopassword/:token', crearNuevoPassword)

// Login tradicional
router.post('/login', login)

// ===== GOOGLE OAUTH =====

// Iniciar autenticación con Google
router.get(
  '/auth/google',
  (req, res, next) => {
    // Guardar URL de retorno en la sesión
    const redirectUrl = req.query.redirect_uri || process.env.URL_FRONTEND;
    req.session.oauth2return = redirectUrl;
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Callback de Google - debe coincidir con callbackURL en passport.js
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:5173/login?error=google_auth_failed',
    session: false 
  }),
  googleCallback  // ← Usar el controller
)

// Fallo de Google OAuth
router.get('/auth/google/failure', (req, res) => {
  res.status(401).json({
    success: false,
    msg: 'Autenticación con Google fallida'
  })
})

// ===== RUTAS PROTEGIDAS =====

// Perfil del estudiante
router.get('/perfil', verificarTokenJWT, perfil)

// Actualizar perfil
router.put('/actualizarperfil/:id', verificarTokenJWT, actualizarPerfil)

// Actualizar contraseña
router.put('/actualizarpassword/:id', verificarTokenJWT, actualizarPassword)

// ===== RUTAS PARA ADMIN =====

// Obtener todos los usuarios
router.get('/usuarios/todos', verificarTokenJWT, verificarAdmin, listarTodosUsuarios)

// Ver detalles de usuario específico
router.get('/usuarios/:id', verificarTokenJWT, verificarAdmin, verDetallesUsuario) 

// Eliminar usuario
router.delete('/usuarios/eliminar/:id', verificarTokenJWT, verificarAdmin, eliminarUsuario)

export default router