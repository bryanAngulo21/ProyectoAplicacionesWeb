import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // cargar variables de entorno

mongoose.set('strictQuery', true);

const connection = async () => {
  try {
    // Elegir URI según el entorno
    const uri = process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI_PRODUCTION
      : process.env.MONGODB_URI_LOCAL;

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 segundos de timeout
    });

    console.log(`✅ Database connected: ${conn.connection.name} on ${conn.connection.host} - ${conn.connection.port}`);
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  }
};

export default connection;

/*import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URI_LOCAL)
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

export default  connection*/