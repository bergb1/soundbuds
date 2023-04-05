import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express, { Express } from 'express';
import helmet from 'helmet';
import { notFound, errorHandler } from './middlewares';
import { TaskResolver } from './api/resolvers/task';

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

        // Setup Apollo Server
        const apolloServer = new ApolloServer({
            introspection: true,
            schema: await buildSchema({
                resolvers: [TaskResolver],
                validate: false
            })
        });
        await apolloServer.start();
        apolloServer.applyMiddleware({ app });

        // Setup handles
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