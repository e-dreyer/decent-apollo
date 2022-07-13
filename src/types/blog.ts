import {
  nonNull,
  nullable,
  objectType,
  extendType,
  arg,
  inputObjectType,
} from 'nexus'
import { Context } from '../context'

export const Blog = objectType({
  name: 'Blog',
  description: `Represents a unique Blog of the App created by a User. Stores all information regarding the Blog.`,
  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK and ID of the Blog Entity',
    })

    t.field('createdAt', {
      type: 'DateTime',
      description: 'Time-stamp of creation as set by Prisma',
    })

    t.field('updatedAt', {
      type: 'DateTime',
      description: 'Time-stamp of last update as set by Prisma',
    })

    /* Entity Specific Fields */
    t.nonNull.field('authorId', {
      type: nonNull('String'),
      description: 'The unique Id of the User that created the Blog',
    })

    t.nullable.field('name', {
      type: nullable('String'),
      description: 'The unique human readable name of the Blog',
    })

    t.nullable.field('description', {
      type: nullable('String'),
      description: `A public human readable and customizable description of the Blog.`,
    })

    /* Relational Fields created by Prisma */
    t.field('author', {
      type: 'User',
      description:
        'Reference to the User that create the Blog. This is a relational field created by Prisma',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: parent.authorId,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogPosts', {
      type: nullable('BlogPost'),
      description: 'All BlogPosts that belongs to the Blog',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogPost.findMany({
          where: {
            blogId: parent.id,
          },
        })
      },
    })
  },
})

export const BlogQueries = extendType({
  type: 'Query',
  definition(t) {
    /* Blogs */
    t.nullable.list.nullable.field('allBlogs', {
      type: nullable('Blog'),
      description: 'Query all Blog',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blog

          .findMany()

          .then((response) => {
            return response
          })

          .catch((error) => {
            throw Error(`allBlogs: ${error}`)
          })
      },
    }),
      t.nullable.field('blogById', {
        type: nullable('Blog'),
        description: 'Query for a single Blog by Id',
        args: {
          data: nonNull(arg({ type: BlogByIdInput })),
        },
        resolve: async (_parent, args, context: Context) => {
          return await context.prisma.blog.findUnique({
            where: {
              id: args.data.id || undefined,
            },
          })
        },
      })

    t.nonNull.list.nullable.field('blogsByUserId', {
      type: nullable('Blog'),
      description:
        'Query for all Blogs that belong to a specific User by userId',
      args: {
        data: nonNull(arg({ type: BlogsByUserIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.blog.findMany({
          where: {
            authorId: args.data.id,
          },
        })
      },
    })
  },
})

export const BlogByIdInput = inputObjectType({
  name: 'BlogByIdInput',
  description: 'Input arguments for querying Blogs by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
    })
  },
})

export const BlogsByUserIdInput = inputObjectType({
  name: 'BlogsByUserIdInput',
  description:
    'Input arguments for querying Blogs by User Id. Search for the Blogs of a specific User',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
      description: 'The Id of the User that the Blogs belongs to',
    })
  },
})
