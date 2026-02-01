import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const estudianteSchema = new Schema({
    // CAMPOS ORIGINALES
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    apellido:{
        type:String,
        required:true,
        trim:true
    },
    direccion:{
        type:String,
        trim:true,
        default:null
    },
    celular:{
        type:String,
        trim:true,
        default:null
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    rol:{
        type:String,
        enum: ['estudiante', 'admin'],
        default:"estudiante"
    },
    
    // CAMPOS ADICIONALES
    cedula: {
        type: String,
        trim: true
    },
    carrera: {
        type: String,
        trim: true
    },
    nivel: {
        type: Number,
        min: 1,
        max: 6
    },
    bio: {
        type: String,
        maxlength: 500,
        trim: true
    },
    fotoPerfil: {
        url: String,
        publicId: String
    },
    
    // ===== CAMPOS PARA OAUTH =====

    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    facebookId: {
        type: String,
        sparse: true,
        unique: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    lastLogin: {
        type: Date,
        default: null
    }
},{
    timestamps:true
})

// Método para cifrar el password
estudianteSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

// Método para verificar si el password es el mismo de la BDD
estudianteSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

// Método para crear un token 
estudianteSchema.methods.createToken= function(){
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

// Método para actualizar último login
estudianteSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    return await this.save();
};

export default model('Estudiante',estudianteSchema)