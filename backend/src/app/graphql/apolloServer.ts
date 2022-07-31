import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { messageResolvers, messageTypes } from './message';

const PORT: string | number = process.env.PORT || 4000;
const pubsub = new PubSub();

const defaultTypeDefs = gql`
  type Query
  type Mutation
  type Subscription
`;

const typeDefs = [defaultTypeDefs, messageTypes];
const resolvers = [messageResolvers];

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const getDynamicContext = async (_ctx: any, _msg: any, _args: any) => {
  return { pubsub };
};

const serverCleanup = useServer(
  {
    schema,
    context: (ctx, msg, args) => {
      return getDynamicContext(ctx, msg, args);
    },
  },
  wsServer
);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res, pubsub }),
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

server.applyMiddleware({ app });

// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
  );
});
