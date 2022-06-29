import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany();
  const allProfiles = await prisma.profile.findMany();
  const allBlogs = await prisma.blog.findMany();
  const allBlogPosts = await prisma.blogPost.findMany();
  const allBlogComments = await prisma.blogComment.findMany();
  console.log(allUsers);
  console.log(allProfiles);
  //  console.log(allBlogs);
  //  console.log(allBlogPosts);
  //  console.log(allBlogComments);
}

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
    }

    type Profile {
      id: ID!
      createdAt: String!
      updatedAt: String!
      user: User
      username: String
    }

    type Blog {
      id: ID!
      createdAt: String!
      updatedAt: String!
      author: User
      name: String!
      description: String
      blogPosts: [BlogPost]
    }

    type BlogPost {
      id: ID!
      createdAt: String!
      updatedAt: String!
      author: User
      blog: Blog!
      blogComments: [BlogComment]
      title: String!
      content: String!
    }

    type BlogComment {
      id: ID!
      createdAt: String!
      updatedAt: String!
      author: User
      blogPost: BlogPost
      parent: BlogComment
      content: String
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
        return prisma.user.findMany();
      },
      user(id: number) {
        return prisma.user.findUnique({
          where: {
            id: id,
          },
        });
      },

      profiles() {
        return prisma.profile.findMany();
      },
      profile(id: number) {
        return prisma.profile.findUnique({
          where: {
            id: id,
          },
        });
      },

      blogs() {
        return prisma.blog.findMany();
      },
      blog(id: number) {
        return prisma.blog.findUnique({
          where: {
            id: id,
          },
        });
      },

      blogPosts() {
        return prisma.blogPost.findMany();
      },
      blogPost(id: number) {
        return prisma.blogPost.findUnique({
          where: {
            id: id,
          },
        });
      },

      blogComments() {
        return prisma.blogComment.findMany();
      },
      blogComment(id: number) {
        return prisma.blogComment.findUnique({
          where: {
            id: id,
          },
        });
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
main();
