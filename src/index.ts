import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

import { prisma } from "./prisma/client";

// Main function to run the server
async function startServer() {
  // Create an instance of express and an http server
  const app = express();
  const httpServer = createServer(app);

  // Define API schema
  const typeDefs = gql`
    type Query {
      users: [User]
      profiles: [Profile]
      blogs: [Blog]
    }

    type User {
      id: ID!
    }

    type Profile {
      id: ID!
    }

    type Blog {
      id: ID!
    }
  `;

  // Resolvers for handling the logic and response of each typeDef
  const resolvers = {
    Query: {
      users() {
        prisma.user.findMany();
      },
      profiles() {
        prisma.profile.findMany();
      },
      blogs() {
        prisma.blog.findMany();
      },
    },
  };

  // Initialize the Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo before applying middleware
  await apolloServer.start();

  // Apply middleware
  apolloServer.applyMiddleware({
    app,
    path: "/api",
  });

  // Tell the server on which port to listen
  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  );
}

// Start the server
startServer();
