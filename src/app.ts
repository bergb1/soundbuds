import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { notFound, errorHandler } from './middlewares';

// Configuration for Express
const conf_app = async (app: Express) => {
    try {
        app.use(notFound);
        app.use(errorHandler);
    } catch (err) {
        console.log(err);
    }
}

// Perform the configuration
const app = express();

// Configure middleware
app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false
    })
);
app.use(cors<cors.CorsRequest>());
app.use(express.json());

// Configure the app
conf_app(app);

export default app;