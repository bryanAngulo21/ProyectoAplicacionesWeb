import jwt from "jsonwebtoken"
import Estudiante from "../models/Estudiante.js"
import Publicacion from "../models/Publicacion.js"

const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const verificarTokenJWT = async (req, res, next) => {
    const { authorization } = req.headers
    
    if (!authorization) {
        return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" })
    }
    
    try {
        const token = authorization.split(" ")[1]
        const { id, rol } = jwt.verify(token, process.env.JWT_SECRET)
        
        if (rol === "estudiante" || rol === "admin") {
            const estudianteBDD = await Estudiante.findById(id).lean().select("-password")
            if (!estudianteBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            
            req.estudianteHeader = estudianteBDD
            next()
        }
        else if (rol === "publicacion") {
            const publicacionBDD = await Publicacion.findById(id).lean().select("-passwordAutor")
            if (!publicacionBDD) return res.status(401).json({ msg: "Publicación no encontrada" })
            req.publicacionHeader = publicacionBDD
            next()
        }
        else {
            return res.status(401).json({ msg: "Rol no válido" })
        }
        
    } catch (error) {
        console.log("❌ JWT Error:", error.message)
        return res.status(401).json({ msg: `Token inválido o expirado` })
    }
}

// Middleware para verificar si es admin
const verificarAdmin = (req, res, next) => {
    if (!req.estudianteHeader || req.estudianteHeader.rol !== 'admin') {
        return res.status(403).json({ 
            msg: "Acceso denegado: se requieren permisos de administrador" 
        })
    }
    next()
}

export { 
    crearTokenJWT,
    verificarTokenJWT,
    verificarAdmin
}