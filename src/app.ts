import express, { Express } from 'express';
import helmet from 'helmet';
import { notFound, errorHandler } from './middlewares';

// Configuration for Express
const conf_app = async (app: Express) => {
    try {
        // Configure helmet
        app.use(
            helmet({
                crossOriginEmbedderPolicy: false,
                contentSecurityPolicy: false
            })
        );

        app.use(notFound);
        app.use(errorHandler);

    } catch (err) {
        console.error((err as Error).message);
    }
}

// Perform the configuration
const app = express();
conf_app(app);

export default app;