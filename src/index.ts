require('dotenv').config();
import 'reflect-metadata';
import app from './app';

// Get/Set the listening port
const port = process.env.PORT || 3000;

// Main function
const main = async () => {
  try {
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