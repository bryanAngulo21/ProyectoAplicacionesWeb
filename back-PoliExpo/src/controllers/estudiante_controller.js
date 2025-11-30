
import Estudiante from "../models/Estudiante.js"
import { sendMailToRecoveryPassword, sendMailToRegister } from "../helpers/sendMail.js"

//Prtoteccion de rutas
import { crearTokenJWT } from "../middlewares/JWT.js"
//actualizar perfil
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

/*
const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params
        const estudianteBDD = await Estudiante.findOne({ token })
        if (!estudianteBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        estudianteBDD.token = null
        estudianteBDD.confirmEmail = true
        await estudianteBDD.save()
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}*/

const confirmarMail = async (req, res) => {
  try {
    const { token } = req.params;
    const estudianteBDD = await Estudiante.findOne({ token });

    if (!estudianteBDD) {
      // Redirigir con mensaje de error al frontend
      return res.redirect(`${process.env.URL_FRONTEND}/confirmado?status=error`);
    }

    estudianteBDD.token = null;
    estudianteBDD.confirmEmail = true;
    await estudianteBDD.save();

    // Redirigir al frontend con mensaje de éxito
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

        //Paso 1 capturar los daros del req.body
        // los inputs en fron se deben llamar email y password

        const {email,password} = req.body

        //Pso 2 comprobacion de espacios vacios     
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        
            
        const estudianteBDD = await Estudiante.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
        if(!estudianteBDD) return res.status(404).json({msg:"El usuario no se encuentra registrado"})
        if(!estudianteBDD.confirmEmail) return res.status(403).json({msg:"Debes verificar tu cuenta antes de iniciar sesión"})
        const verificarPassword = await estudianteBDD.matchPassword(password)
         if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})

        //Paso 3
        //aplico desestructuracion 
        const {nombre,apellido,direccion,telefono,_id} = estudianteBDD
        //const {nombre,apellido,direccion,telefono,_id,rol,correo} = estudianteBDD
        const token = crearTokenJWT(estudianteBDD._id,estudianteBDD.rol)

        //Paso 4 

        //solo mando la informacion que se requiere 
        res.status(200).json({
            //rol,
            token,
            nombre,
            apellido,
            direccion,
            telefono,
            _id,
            email:estudianteBDD.email
            //correo
        })


    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const perfil =(req,res)=>{
	const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.estudianteHeader 
    res.status(200).json(datosPerfil)
}


const actualizarPerfil = async (req,res)=>{

    try {
         //Paso 1 obtener datos que recibe el controlador del backend 
        const{_id}=req.estudianteHeader
        const {nombre,apellido,direccion,celular,email} = req.body

        const estudianteBDD = await Estudiante.findById(_id)
        if(!estudianteBDD) return res.status(404).json({ msg: `No existe el estudiante con ID ${id}` })
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
        if (estudianteBDD.email !== email)
        {
            const emailExistente  = await Estudiante.findOne({email})
            if (emailExistente )
            {
                return res.status(404).json({msg:`El email ya se encuentra registrado`})  
            }
        }
        estudianteBDD.nombre = nombre ?? estudianteBDD.nombre
        estudianteBDD.apellido = apellido ?? estudianteBDD.apellido
        estudianteBDD.direccion = direccion ?? estudianteBDD.direccion
        estudianteBDD.celular = celular ?? estudianteBDD.celular
        estudianteBDD.email = email ?? estudianteBDD.email
        await estudianteBDD.save()
        res.status(200).json(estudianteBDD)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarPassword = async (req,res)=>{
    try {
       
    //Paso 1 obtener datos que recibe el controlador del backend 
        const{passwordactual, passwordnuevo}=req.body
        const{_id}=req.estudianteHeader
        //Paso2
        const estudianteBDD = await Estudiante.findById(_id)
        if(!estudianteBDD) return res.status(404).json({msg:`Lo sentimos, no existe el estudiante ${id}`})

        const verificarPassword = await estudianteBDD.matchPassword(passwordactual)
        if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
        
        
        //Paso 3 Logica cuando se ingrese la contrasena se guarda encriptda en la base de datos
        estudianteBDD.password = await estudianteBDD.encryptPassword(passwordnuevo)
        //metodo asincrono para guardar
        await estudianteBDD.save()
        //Paso 4 mopswtrar respuesta con res.status
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