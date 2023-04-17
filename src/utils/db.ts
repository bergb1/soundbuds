import mongoose, { Mongoose } from 'mongoose';

// Function to start a Database connection
const mongoConnect = async (uri: string): Promise<Mongoose> => {
  const conn = await mongoose.connect(uri);
  console.log('DB connected successfully');
  return conn;
};

export default mongoConnect;