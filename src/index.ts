import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import * as path from 'path'
import * as types from "./types"
import { makeSchema} from 'nexus'

const prisma = new PrismaClient();

// Main function to run the server
async function startServer() {
  // Create an instance of express and an http server
  const app = express();
  const httpServer = createServer(app);

  // Initialize the Apollo Server
  const apolloServer = new ApolloServer({
    context: () => ({ prisma }),
    schema: makeSchema({
      sourceTypes: {
        modules: [{ module: ".prisma/client", alias: "PrismaClient" }],
      },
      contextType: {
        module: path.join(__dirname, "context.ts"),
        export: "Context",
      },
      outputs: {
        typegen: path.join(
          __dirname,
          "../generated/types.d.ts"
        ),
        schema: path.join(__dirname, "../generated/api.graphql"),
      },
      shouldExitAfterGenerateArtifacts: Boolean(
        process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION
      ),
      types,
    }),

    introspection: true,
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
