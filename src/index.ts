import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import app from './app';
import mongoConnect from './utils/db';
import userModel from './api/models/userModel';
import { User } from './interfaces/User';

dotenv.config();
const salt = bcrypt.genSaltSync(10);
export { salt };

// Get the database uri
const dbUri = process.env.DATABASE_URL;

// Get the database uri
if (!dbUri || !process.env.JWT_SECRET || !process.env.ROOT_EMAIL || !process.env.ROOT_PWD) {
  throw Error('environmental variables undefined');
}

// Get/Set the listening port
const port = process.env.PORT || 3000;

// Function to set the root
const rootUser = async () => {
  // Check if the root exists in the database
  const root = await userModel.findOne({email: process.env.ROOT_EMAIL as string});
  if (!root) {
    // Create the root
    const user: User = {
      username: 'root',
      email: process.env.ROOT_EMAIL as string,
      password: await bcrypt.hash(process.env.ROOT_PWD as string, salt),
      role: 'root',
      profile_color: 'LightGray'
    }
    
    // Validate the root
    const result = await userModel.create(user);
    if (result) {
      console.log('root user created');
    } else {
      throw new Error(`could not create a root user`);
    }
  }
}

// Main function
const main = async () => {
  try {
    // Setup the database connection
    await mongoConnect(dbUri);

    // Manage the root user
    await rootUser();

    // Start listening to the port
    app.listen(port, () => {
      console.log(`Listening: http://localhost:${port}`);
    });
  } catch (err) {
    console.error((err as Error).message);
  }
};

// Execute the main
main();