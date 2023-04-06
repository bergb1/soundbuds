import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express, { Express } from 'express';
import helmet from 'helmet';
import { notFound, errorHandler } from './middlewares';
import { UserResolver } from './api/resolvers/userResolver';

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
            introspection: process.env.NODE_ENV === 'development',
            schema: await buildSchema({
                resolvers: [UserResolver],
                validate: false
            })
        });
        await apolloServer.start();
        apolloServer.applyMiddleware({ app });

        // Setup handles
        app.use(
            '/graphql',
            express.json()
        )
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