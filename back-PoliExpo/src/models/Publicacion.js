import mongoose, {Schema,model} from 'mongoose'
import bcrypt from "bcryptjs"

const publicacionSchema = new Schema({

    nombreAutor:{
        type:String,
        required:true,
        trim:true
    },
    cedulaAutor:{
        type:String,
        required:true,
        trim:true
    },
    emailAutor:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    passwordAutor:{
        type:String,
        required:true
    },
    celularAutor:{
        type:String,
        required:true,
        trim:true
    },
    nombrePublicacion:{
        type:String,
        required:true,
        trim:true
    },
    imagenPublicacion:{
        type:String,
        trim:true
    },
    imagenPublicacionID:{
        type:String,
        trim:true
    },
    imagenPublicacionIA:{
        type:String,
        trim:true
    },
    tipoPublicacion:{
        type:String,
        required:true,
        trim:true
    },
    fechaCreacionPublicacion:{
        type:Date,
        required:true,
        trim:true
    },
    detallePublicacion:{
        type:String,
        required:true,
        trim:true
    },
    fechaIngresoPublicacion:{
        type:Date,
        required:true,
        trim:true,
        default:Date.now
    },
    finPublicacion:{
        type:Date,
        trim:true,
        default:null
    },
    estadoPublicacion:{
        type:Boolean,
        default:true
    },
    rol:{
        type:String,
        default:"publicacion"
    },
    estudiante:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Estudiante'
    }
},{
    timestamps:true
})


// Método para cifrar el password
publicacionSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}


// Método para verificar si el password es el mismo de la BDD
publicacionSchema.methods.matchPassword = async function(password){
    return bcrypt.compare(password, this.passwordAutor)
}


export default model('Publicacion',publicacionSchema)