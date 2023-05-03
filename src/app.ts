import express, { Express } from 'express';
import api from './api';
import helmet from 'helmet';
import cors from 'cors';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import MyContext from './interfaces/MyContext';
import { expressMiddleware } from '@apollo/server/express4';
import authenticate from './auth';
import { notFound, errorHandler } from './middlewares';

// Configuration for Express
const conf_app = async (app: Express) => {
    try {
        // Configure middleware
        app.use(
            helmet({
                crossOriginEmbedderPolicy: false,
                contentSecurityPolicy: false
            })
        );

        // Setup graphql schema
        const schema = applyMiddleware(
            makeExecutableSchema({
                typeDefs,
                resolvers,
            })
        );

        // Setup apollo server
        const server = new ApolloServer<MyContext>({
            schema,
            introspection: true,
            includeStacktraceInErrorResponses: false,
        });
        await server.start();

        app.use(
            '/graphql',
            cors<cors.CorsRequest>(),
            express.json(),
            expressMiddleware(server, {
                context: async ({req}) => authenticate(req),
            })
        );

        app.use('/api', api);
        app.use('/images', express.static('uploads'));
        app.use(notFound);
        app.use(errorHandler);
    } catch (err) {
        console.log(err);
    }
}

// Perform the configuration
const app = express();

// Configure the app
conf_app(app);

export default app;