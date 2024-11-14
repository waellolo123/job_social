import mongoose from "mongoose"

export const connectDB = async () => {
  try {
   const conn = await mongoose.connect(process.env.MONGO);
    console.log(`mongo db connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error to Mongo DB: ${error.message}`);
    process.exit(1);
    
  }
}

