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
import {createRateLimitRule} from 'graphql-rate-limit';
import {shield} from 'graphql-shield';
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';

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

        const rateLimitRule = createRateLimitRule({
            identifyContext: (ctx) => ctx.id,
          });
      
          const permissions = shield({
            Mutation: {
              login: rateLimitRule({window: '5s', max: 5}),
            },
          });

        // Setup graphql schema
        const schema = applyMiddleware(
            makeExecutableSchema({
                typeDefs,
                resolvers,
            }),
            permissions
        );

        // Setup apollo server
        const server = new ApolloServer<MyContext>({
            schema,
            introspection: true,
            plugins: [
                process.env.NODE_ENV === 'production'
                    ? ApolloServerPluginLandingPageProductionDefault({
                        embed: true as false,
                    })
                    : ApolloServerPluginLandingPageLocalDefault(),
            ],
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