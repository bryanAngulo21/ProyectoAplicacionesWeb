import Estudiante from "../models/Estudiante.js"
import { sendMailToRecoveryPassword, sendMailToRegister } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

const registro = async (req,res)=>{
    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Estudiante.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
       
        const nuevoEstudiante = new Estudiante(req.body)
        nuevoEstudiante.password = await nuevoEstudiante.encryptPassword(password)
        
        const token = nuevoEstudiante.createToken()

        await sendMailToRegister(email,token)
        await nuevoEstudiante.save()

        res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
      
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const confirmarMail = async (req, res) => {
  try {
    const { token } = req.params;
    const estudianteBDD = await Estudiante.findOne({ token });

    if (!estudianteBDD) {
      return res.redirect(`${process.env.URL_FRONTEND}/confirmado?status=error`);
    }

    estudianteBDD.token = null;
    estudianteBDD.confirmEmail = true;
    await estudianteBDD.save();

    res.redirect(`${process.env.URL_FRONTEND}/confirmado?status=success`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.URL_FRONTEND}/confirmado?status=error`);
  }
};

const recuperarPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const estudianteBDD = await Estudiante.findOne({ email })
        if (!estudianteBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        const token = estudianteBDD.createToken()
        estudianteBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await estudianteBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const comprobarTokenPasword = async (req,res)=>{
    try {
        const {token} = req.params
        const estudianteBDD = await Estudiante.findOne({token})
        if(estudianteBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const crearNuevoPassword = async (req,res)=>{
    try {
        const{password,confirmpassword} = req.body
        const { token } = req.params
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        if(password !== confirmpassword) return res.status(404).json({msg:"Los passwords no coinciden"})
        const estudianteBDD = await Estudiante.findOne({token})
        if(!estudianteBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
        estudianteBDD.token = null
        estudianteBDD.password = await estudianteBDD.encryptPassword(password)
        await estudianteBDD.save()
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body
        
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
            
        const estudianteBDD = await Estudiante.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
        if(!estudianteBDD) return res.status(404).json({msg:"El usuario no se encuentra registrado"})
        if(!estudianteBDD.confirmEmail) return res.status(403).json({msg:"Debes verificar tu cuenta antes de iniciar sesión"})
        const verificarPassword = await estudianteBDD.matchPassword(password)
        if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})

        // Actualizar último login
        if (estudianteBDD.updateLastLogin) {
            await estudianteBDD.updateLastLogin()
        }

        const {nombre, apellido, direccion, celular, _id, rol, carrera, nivel, cedula, fotoPerfil, authProvider} = estudianteBDD
        const token = crearTokenJWT(estudianteBDD._id, estudianteBDD.rol)

        res.status(200).json({
            token,
            rol,
            nombre,
            apellido,
            direccion,
            celular,
            carrera,
            nivel,
            cedula,
            fotoPerfil,
            authProvider,
            _id,
            email: estudianteBDD.email
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// Login/Registro con Google (desde passport callback)
const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.URL_FRONTEND}/login?error=google_auth_failed`);
    }

    const estudiante = req.user;
    
    if (estudiante.updateLastLogin) {
      await estudiante.updateLastLogin();
    }

    const token = crearTokenJWT(estudiante._id, estudiante.rol);

    // URL de retorno (por defecto al frontend)
    const returnUrl = req.session.oauth2return || process.env.URL_FRONTEND;
    
    // Crear URL con los datos en fragmento (no se envía al servidor)
    const redirectUrl = new URL(`${returnUrl}/google-callback`);
    
    // Los datos van en el fragmento (después del #)
    const fragmentData = {
      token: token,
      rol: estudiante.rol,
      nombre: estudiante.nombre,
      email: estudiante.email,
      _id: estudiante._id.toString()
    };
    
    redirectUrl.hash = `#google-auth-${btoa(JSON.stringify(fragmentData))}`;
    
    res.redirect(redirectUrl.toString());

  } catch (error) {
    console.error("❌ Error en callback Google:", error);
    res.redirect(`${process.env.URL_FRONTEND}/login?error=google_auth_failed`);
  }
};

const perfil =(req,res)=>{
    const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.estudianteHeader 
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req,res)=>{
    try {
        const{_id}=req.estudianteHeader
        const {nombre, apellido, direccion, celular, email, carrera, nivel, cedula, bio, fotoPerfil} = req.body

        const estudianteBDD = await Estudiante.findById(_id)
        if(!estudianteBDD) return res.status(404).json({ msg: `No existe el estudiante con ID ${_id}` })
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
        if (estudianteBDD.email !== email) {
            const emailExistente  = await Estudiante.findOne({email})
            if (emailExistente) {
                return res.status(404).json({msg:`El email ya se encuentra registrado`})  
            }
        }
        
        // Actualizar campos
        estudianteBDD.nombre = nombre ?? estudianteBDD.nombre
        estudianteBDD.apellido = apellido ?? estudianteBDD.apellido
        estudianteBDD.direccion = direccion ?? estudianteBDD.direccion
        estudianteBDD.celular = celular ?? estudianteBDD.celular
        estudianteBDD.email = email ?? estudianteBDD.email
        estudianteBDD.carrera = carrera ?? estudianteBDD.carrera
        estudianteBDD.nivel = nivel ?? estudianteBDD.nivel
        estudianteBDD.cedula = cedula ?? estudianteBDD.cedula
        estudianteBDD.bio = bio ?? estudianteBDD.bio
        estudianteBDD.fotoPerfil = fotoPerfil ?? estudianteBDD.fotoPerfil
        
        await estudianteBDD.save()
        res.status(200).json(estudianteBDD)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarPassword = async (req,res)=>{
    try {
        const{passwordactual, passwordnuevo}=req.body
        const{_id}=req.estudianteHeader
        
        const estudianteBDD = await Estudiante.findById(_id)
        if(!estudianteBDD) return res.status(404).json({msg:`Lo sentimos, no existe el estudiante ${_id}`})

        const verificarPassword = await estudianteBDD.matchPassword(passwordactual)
        if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
        
        estudianteBDD.password = await estudianteBDD.encryptPassword(passwordnuevo)
        await estudianteBDD.save()
        
        res.status(200).json({msg:"Password actualizado correctamente"})
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// PARA USER ADMIN

// 1. Listar todos los usuarios (para admin)
const listarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Estudiante.find()
      .select('-password -token')  // No enviar datos sensibles
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      msg: "Usuarios obtenidos",
      data: usuarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
}

// 2. Eliminar usuario (para admin)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe
    const usuario = await Estudiante.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    
    /// Eliminar el usuario
    await usuario.deleteOne();
    
    res.status(200).json({ 
      msg: "Usuario eliminado correctamente",
      usuarioId: id
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
}


// 3. Ver detalles de usuario (para admin)
const verDetallesUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await Estudiante.findById(id)
      .select('-password -token');  // No enviar datos sensibles
    
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    
    res.status(200).json({
      msg: "Detalles del usuario obtenidos",
      data: usuario
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener detalles del usuario" });
  }
};

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    login,
    googleCallback,
    perfil,
    actualizarPerfil,
    actualizarPassword,
    listarTodosUsuarios,
    eliminarUsuario,
    verDetallesUsuario
}