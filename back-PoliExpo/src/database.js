import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Activar strictQuery
mongoose.set('strictQuery', true);

const connection = async () => {
  try {
    // Elegir URI según entorno
    const uri = process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI_PRODUCTION // URL de producción (deploy)
      : process.env.MONGODB_URI_LOCAL;     // URL local

    const { connection: dbConnection } = await mongoose.connect(uri);

    console.log(`✅ Database connected: ${dbConnection.name} on ${dbConnection.host}`);
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
        console.log(`Database is connected on ${connection.host} `)
    } catch (error) {
        console.log(error);
    }
}

export default  connection*/