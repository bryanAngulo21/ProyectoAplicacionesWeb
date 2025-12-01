import { getRandomImage } from "../services/imagenFondo.js";
import { sendMailToRecoveryPassword, sendMailToRegister } from "../helpers/sendMail.js"
import Veterinario from "../models/Veterinario.js"
import { getRandomQuote } from "../services/frases.js";
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

export const getUnsplashImage = async (req, res) => {
    const { query = "motivational" } = req.query;
    const imageUrl = await getRandomImage(query);
    res.json({ imageUrl });
};

export const fetchQuoteController = async (req, res) => {
  const quote = await getRandomQuote();
  res.json(quote);
};

const registro = async (req, res) => {
    try {
        const { email, password } = req.body
        
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})
        }
        
        const verificarEmailBDD = await Veterinario.findOne({email})
        if(verificarEmailBDD) {
            return res.status(400).json({msg: "Lo sentimos, el email ya se encuentra registrado"})
        }
        
        const nuevoVeterinario = new Veterinario(req.body)
        const token = nuevoVeterinario.createToken()
       
        
        console.log("📧 Enviando correo a:", email)
        
        // Espera el resultado del envío
        const emailResult = await sendMailToRegister(email, token)
        
        if (!emailResult || !emailResult.success) {
            console.error("⚠️ El correo no se envió correctamente")
            // Aún así guardamos el usuario
        }
        
        await nuevoVeterinario.save()
        
        res.status(200).json({
            success: true,
            msg: "Revisa tu correo electrónico para confirmar tu cuenta"
        })

    } catch (error) {
        console.error("❌ Error en registro:", error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params
        const veterinarioBDD = await Veterinario.findOne({ token })
        if (!veterinarioBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        veterinarioBDD.token = null
        veterinarioBDD.confirmEmail = true
        await veterinarioBDD.save()
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const recuperarPassword = async (req, res) => {
     try {
        const { email } = req.body
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const veterinarioBDD = await Veterinario.findOne({ email })
        if (!veterinarioBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        const token = veterinarioBDD.createToken()
        veterinarioBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await veterinarioBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
        
    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }    
}



const comprobarTokenPasword = async (req,res)=>{
    try {
        const {token} = req.params
        const veterinarioBDD = await Veterinario.findOne({token})
        if(veterinarioBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
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
        const veterinarioBDD = await Veterinario.findOne({token})
        if(!veterinarioBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
            
        
        veterinarioBDD.password = await veterinarioBDD.encryptPassword(password)
        veterinarioBDD.token = null
        await veterinarioBDD.save()
        
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
    
    
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body

        //  Verifica que todos los campos estén llenos
        if (Object.values(req.body).includes("")) 
            return res.status(404).json({ msg: "Debes llenar todos los campos" })

        //  Busca al veterinario por email
        const veterinarioBDD = await Veterinario.findOne({ email })
            .select("-status -__v -token -updatedAt -createdAt")
        if (!veterinarioBDD) 
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" })

        //  Verifica que haya confirmado su email
        if (!veterinarioBDD.confirmEmail) 
            return res.status(403).json({ msg: "Debes verificar tu cuenta antes de iniciar sesión" })

        //  Verifica la contraseña
        const verificarPassword = await veterinarioBDD.matchPassword(password)
        if (!verificarPassword) 
            return res.status(401).json({ msg:"Lo sentimos, el password no es el correcto" })

        //  Extrae los datos necesarios
        const { nombre, apellido, direccion, celular, _id, rol } = veterinarioBDD

        //  Crea el token JWT
        const token = crearTokenJWT(_id, rol)

        //  Devuelve token + datos del usuario
        res.status(200).json({
            token,
            rol,
            nombre,
            apellido,
            direccion,
            celular,
            _id,
            email: veterinarioBDD.email
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const perfil = (req, res) => {
  try {
    // Paso 1: ya se realiza en el middleware

    // Paso 2 y 3
    const { token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil } =
      req.veterinarioHeader;

    // Paso 4
    res.status(200).json(datosPerfil);

  } catch (error) {
    res.status(500).json({
      msg: `Error en el servidor: ${error}`
    });
  }
};

const actualizarPerfil = async (req,res)=>{

    try {
        const {id} = req.params
        const {nombre,apellido,direccion,celular,email} = req.body
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(400).json({msg:`ID inválido: ${id}`})
        const veterinarioBDD = await Veterinario.findById(id)
        if(!veterinarioBDD) return res.status(404).json({ msg: `No existe el veterinario con ID ${id}` })
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
        if (veterinarioBDD.email !== email)
        {
            const emailExistente  = await Veterinario.findOne({email})
            if (emailExistente )
            {
                return res.status(404).json({msg:`El email ya se encuentra registrado`})  
            }
        }
        veterinarioBDD.nombre = nombre ?? veterinarioBDD.nombre
        veterinarioBDD.apellido = apellido ?? veterinarioBDD.apellido
        veterinarioBDD.direccion = direccion ?? veterinarioBDD.direccion
        veterinarioBDD.celular = celular ?? veterinarioBDD.celular
        veterinarioBDD.email = email ?? veterinarioBDD.email
        await veterinarioBDD.save()
        res.status(200).json(veterinarioBDD)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


const actualizarPassword = async (req,res)=>{
    try {
        const veterinarioBDD = await Veterinario.findById(req.veterinarioHeader._id)
        if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
        const verificarPassword = await veterinarioBDD.matchPassword(req.body.passwordactual)
        if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
        veterinarioBDD.password = await veterinarioBDD.encryptPassword(req.body.passwordnuevo)
        await veterinarioBDD.save()

    res.status(200).json({msg:"Password actualizado correctamente"})
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}




export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
}



