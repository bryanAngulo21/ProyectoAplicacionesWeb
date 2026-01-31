import { sendMailToOwner } from "../helpers/sendMail.js"
import { subirBase64Cloudinary, subirImagenCloudinary, eliminarImagenCloudinary } from "../helpers/uploadCloudinary.js"
import Publicacion from "../models/Publicacion.js"

import mongoose from "mongoose"




const registrarPublicacion = async(req,res)=>{

    try {
        const {emailAutor} = req.body

        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})

        const emailExistente = await Publicacion.findOne({emailAutor})
        
        if(emailExistente) return res.status(400).json({msg:"El email ya se encuentra registrado"})

        const password = Math.random().toString(36).toUpperCase().slice(2, 5)

        const nuevoPublicacion = new Publicacion({
            ...req.body,
            passwordAutor: await Publicacion.prototype.encryptPassword("POLIEXPO"+password),
            estudiante: req.estudianteHeader._id
        })

        if (req.files?.imagen) {
            const { secure_url, public_id } = await subirImagenCloudinary(req.files.imagen.tempFilePath)
            nuevoPublicacion.imagenPublicacion = secure_url
            nuevoPublicacion.imagenPublicacionID = public_id
        }

        if (req.body?.imagenPublicacionIA) {
            const secure_url = await subirBase64Cloudinary(req.body.imagenPublicacionIA)
            nuevoPublicacion.imagenPublicacionIA = secure_url
        }

        await nuevoPublicacion.save()
        await sendMailToOwner(emailAutor,"POLIEXPO"+password)
        res.status(201).json({ msg: "Registro exitoso de la publicacion y correo enviado al autor" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const listarPublicaciones= async (req,res)=>{
    try {
        const publicaciones = await Publicacion.find({ estadoPublicacion: true, estudiante: req.estudianteHeader._id }).select("-salida -createdAt -updatedAt -__v").populate('estudiante','_id nombre apellido')
        res.status(200).json(publicaciones)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const detallePublicacion = async(req,res)=>{

    try {
        const {id} = req.params
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`No existe el estudiante${id}`});
        const publicacion = await Publicacion.findById(id).select("-createdAt -updatedAt -__v").populate('estudiante','_id nombre apellido')
        res.status(200).json(publicacion)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const eliminarPublicacion = async (req,res)=>{

    try {
        const {id} = req.params
        const {finPublicacion} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`No existe la publicacion ${id}`})
        await Publicacion.findByIdAndUpdate(id,{finPublicacion:Date.parse(finPublicacion),estadoPublicacion:false})
        res.status(200).json({msg:"Fecha de finalizacion de publicacion registrada exitosamente"})

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarPublicacion = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el estudiante ${id}`})
    if (req.files?.imagen) {
            const publicacion = await Publicacion.findById(id)

            if (publicacion.imagenPublicacionID) {
                await eliminarImagenCloudinary(publicacion.imagenPublicacionID)
            }

            const { secure_url, public_id } = await subirImagenCloudinary(
                req.files.imagen.tempFilePath
            )

            req.body.imagenPublicacion = secure_url
            req.body.imagenPublicacionID = public_id
        }

    await Publicacion.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({msg:"Actualización exitosa de la publicacion"})
}

export{
    registrarPublicacion,
    listarPublicaciones,
    detallePublicacion,
    eliminarPublicacion,
    actualizarPublicacion 
}