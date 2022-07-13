import {
  nonNull,
  nullable,
  objectType,
  extendType,
  arg,
  inputObjectType,
} from 'nexus'
import { Context } from '../context'

export const BlogComment = objectType({
  name: 'BlogComment',
  description: `Represents a unique BlogComment of the App created by a User. Stores all information regarding the BlogComment.`,
  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK and ID of the BlogComment Entity',
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

    t.nonNull.field('content', {
      type: nonNull('String'),
      description: 'The User created content of the BlogComment',
    })

    t.nonNull.field('blogPostId', {
      type: nonNull('String'),
      description: 'The Id of the BlogPost that the BlogComment belongs to',
    })

    t.nullable.field('parentId', {
      type: nullable('String'),
      description: `The Id of the Parent BlogComment. Can be Null if the BlogComment has no Parent.`,
    })

    t.nonNull.field('authorId', {
      type: nonNull('String'),
      description: 'The Id of the User that created the BlogComment',
    })

    /* Relational Fields used by Prisma */
    t.nullable.field('author', {
      type: nullable('User'),
      description:
        'Reference to the User that create the BlogComment. This is a relational field created by Prisma',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: parent.authorId,
          },
        })
      },
    })

    t.nullable.field('parent', {
      type: nullable('BlogComment'),
      description: `The Parent BlogComment of the BlogComment. Can be Null if the BlogComment is a direct reply to the BlogPost and not to a BlogComment.`,
      resolve: async (parent, _args, context: Context) => {
        if (!parent.parentId) {
          return null
        }

        return await context.prisma.blogComment.findFirst({
          where: {
            id: parent.parentId,
          },
        })
      },
    })

    t.field('blogPost', {
      type: 'BlogPost',
      description: 'The BlogPost that the BlogComment belongs to',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogPost.findFirst({
          where: {
            id: parent.blogPostId,
          },
        })
      },
    })

    t.list.field('blogComments', {
      type: BlogComment,
      description: 'The BlogComments that are children of this BlogComment',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogComment.findMany({
          where: {
            parentId: parent.id,
          },
        })
      },
    })
  },
})

export const BlogCommentsQueries = extendType({
  type: 'Query',
  definition(t) {
    /* BlogComments */
    t.nullable.list.nullable.field('allBlogComments', {
      type: nullable('BlogComment'),
      description: 'Query all BlogComments',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blogComment

          .findMany({
            include: {
              parent: true,
              author: true,
              blogComments: true,
              blogPost: true,
            },
          })

          .then((response) => {
            return response
          })

          .catch((error) => {
            throw Error(`allBlogs: ${error}`)
          })
      },
    }),
      t.nullable.field('blogCommentById', {
        type: nullable('BlogComment'),
        description: 'Query for a single BlogComment by Id',
        args: {
          data: nonNull(arg({ type: BlogCommentByIdInput })),
        },
        resolve: async (_parent, args, context: Context) => {
          return await context.prisma.blogComment.findUnique({
            where: {
              id: args.data.id || undefined,
            },
          })
        },
      })

    t.nonNull.list.nullable.field('blogCommentsByUserId', {
      type: nullable('BlogComment'),
      description: 'Query for all BlogComments that belong to a specific User',
      args: {
        data: nonNull(arg({ type: BlogCommentsByUserIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.blogComment.findMany({
          where: {
            authorId: args.data.id,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogCommentsByPostId', {
      type: nullable('BlogComment'),
      description: `Query for all BlogComments that belong to a specific BlogPost`,
      args: {
        data: nonNull(arg({ type: BlogCommentsByPostIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.blogComment.findMany({
          where: {
            blogPostId: args.data.id,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogCommentsByParentCommentId', {
      type: nullable('BlogComment'),
      description: `Query for all BlogComments that belong to a specific Parent BlogComment`,
      args: {
        data: nonNull(arg({ type: BlogCommentsByParentCommentIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.blogComment.findMany({
          where: {
            parentId: args.data.id,
          },
        })
      },
    })
  },
})

export const BlogCommentByIdInput = inputObjectType({
  name: 'BlogCommentByIdInput',
  description: 'Input arguments for querying Blogs by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
    })
  },
})

export const BlogCommentsByUserIdInput = inputObjectType({
  name: 'BlogCommentsByUserIdInput',
  description:
    'Input arguments for querying BlogComments by User Id. Search for BlogComments of a specific User',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
      description: 'The Id of the User that the BlogComment belongs to',
    })
  },
})

export const BlogCommentsByPostIdInput = inputObjectType({
  name: 'BlogCommentsByPostIdInput',
  description:
    'Input arguments for querying BlogComments by BlogPost Id. Search for the BlogComments of a specific BlogPost',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
      description: 'The Id of the BlogPost that the BlogComments belongs to',
    })
  },
})

export const BlogCommentsByParentCommentIdInput = inputObjectType({
  name: 'BlogCommentsByParentCommentIdInput',
  description:
    'Input arguments for querying BlogComments by their Parent BlogComment Id. Search for the BlogComments that replied to a specific BlogComment',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
      description: `The Id of the Parent BlogComment of the BlogComment to search for.`,
    })
  },
})
