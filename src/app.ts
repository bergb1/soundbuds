import express, { Express } from 'express';

// Configuration for Express
const conf_app = async (app: Express) => {
    try {
        // TODO: Configure Express js
    } catch (err) {
        console.error((err as Error).message);
    }
}

// Perform the configuration
const app = express();
conf_app(app);

export default app;