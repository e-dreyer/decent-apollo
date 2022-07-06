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

  // Define API schema
  const typeDefs = gql`
    type User {
      id: ID!
      createdAt: String!
      updatedAt: String!
      blogs: [Blog]
      blogPosts: [BlogPost]
      blogComments: [BlogComment]
      username: String!
      email: String!
    }

    type Profile {
      id: ID!
      createdAt: String!
      updatedAt: String!
      user: User!
      bio: String!
    }

    type Blog {
      id: ID!
      createdAt: String!
      updatedAt: String!
      author: User!
      name: String!
      description: String
      blogPosts: [BlogPost]!
    }

    type BlogPost {
      id: ID!
      createdAt: String!
      updatedAt: String!
      author: User!
      blog: Blog!
      blogComments: [BlogComment]!
      title: String!
      content: String!
    }

    type BlogComment {
      id: ID!
      createdAt: String!
      updatedAt: String!
      author: User!
      blogPost: BlogPost!
      parent: BlogComment!
      content: String!
    }

    type Query {
      users: [User]!
      user: User!
      profiles: [Profile]!
      profile: Profile!
      blogs: [Blog]!
      blog: Blog!
      blogPosts: [BlogPost]!
      blogPost: BlogPost!
      blogComments: [BlogComment]!
      blogComment: BlogComment!
    }
  `;

  // Resolvers for handling the logic and response of each typeDef
  const resolvers = {
    Query: {
      users() {
        return prisma.user.findMany({
          include: {
            profile: true,
            blogs: true,
            blogPosts: true,
            blogComments: true,
          },
        });
      },
      user(id: number) {
        return prisma.user.findUnique({
          where: {
            id: id,
          },
          include: {
            profile: true,
            blogs: true,
            blogPosts: true,
            blogComments: true,
          },
        });
      },

      profiles() {
        return prisma.profile.findMany({
          include: {
            user: true,
          },
        });
      },
      profile(id: number) {
        return prisma.profile.findUnique({
          where: {
            id: id,
          },
          include: {
            user: true,
          },
        });
      },

      blogs() {
        return prisma.blog.findMany({
          include: {
            author: true,
            blogPosts: true,
          },
        });
      },
      blog(id: number) {
        return prisma.blog.findUnique({
          where: {
            id: id,
          },
          include: {
            author: true,
            blogPosts: true,
          },
        });
      },

      blogPosts() {
        return prisma.blogPost.findMany({
          include: {
            author: true,
            blog: true,
            blogComments: true,
          },
        });
      },
      blogPost(id: number) {
        return prisma.blogPost.findUnique({
          where: {
            id: id,
          },
          include: {
            author: true,
            blog: true,
            blogComments: true,
          },
        });
      },

      blogComments() {
        return prisma.blogComment.findMany({
          include: {
            author: true,
            blogPost: true,
            blogComments: true,
            parent: true,
          },
        });
      },
      blogComment(id: number) {
        return prisma.blogComment.findUnique({
          where: {
            id: id,
          },
          include: {
            author: true,
            blogPost: true,
            blogComments: true,
            parent: true,
          },
        });
      },
    },
  };

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
