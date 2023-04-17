import dotenv from 'dotenv';
import app from './app';
import mongoConnect from './utils/db';
dotenv.config();

// Get the database uri
const dbUri = process.env.DATABASE_URL;
if (!dbUri) {
  throw Error('Database URI undefined');
}

// Get/Set the listening port
const port = process.env.PORT || 3000;

// Main function
const main = async () => {
  try {
    // Setup the database connection
    await mongoConnect(dbUri);

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