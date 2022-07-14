import {
  nonNull,
  nullable,
  objectType,
  extendType,
  arg,
  inputObjectType,
} from 'nexus'
import { Context } from '../context'

export const BlogPost = objectType({
  name: 'BlogPost',
  description: `Represents a unique BlogPost of the App created by a User. Stores all information regarding the BlogPost.`,
  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK and ID of the BlogPost Entity',
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
      description: `The unique Id of the User that created the BlogPost.`,
    })

    t.nonNull.field('title', {
      type: nonNull('String'),
      description: 'The human readable Title set by the User',
    })

    t.nonNull.field('content', {
      type: nonNull('String'),
      description: 'The human readable Content set by the User',
    })

    t.nonNull.field('published', {
      type: nonNull('Boolean'),
      description: `Boolean value of whether the User has published the BlogPost and want it to be shown publicly.`,
    })

    /* Relational Fields created by Prisma */
    t.field('author', {
      type: 'User',
      description: `Reference to the User that created the BlogPost. Relational field created by Prisma.`,
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.user.findFirst({
          where: {
            id: parent.authorId,
          },
        })
      },
    })

    t.field('blog', {
      type: 'Blog',
      description: 'The Blog that the BlogPost belongs to',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blog.findFirst({
          where: {
            id: parent.blogId,
          },
        })
      },
    })

    t.nonNull.field('blogId', {
      type: nonNull('String'),
      description: 'The Id of the Blog that the BlogPost belongs to',
    })

    t.list.field('blogComments', {
      type: 'BlogComment',
      description: 'All BlogComments that belong to the BlogPost',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogComment.findMany({
          where: {
            blogPostId: parent.id,
          },
        })
      },
    })
  },
})

export const BlogPostQueries = extendType({
  type: 'Query',
  definition(t) {
    /* BlogPosts */
    t.nullable.list.nullable.field('allBlogPosts', {
      type: nullable('BlogPost'),
      description: 'Query all BlogPosts',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blogPost

          .findMany()

          .then((response) => {
            return response
          })

          .catch((error) => {
            throw Error(`allBlogPosts: ${error}`)
          })
      },
    }),
      t.nullable.field('blogPostById', {
        type: nullable('BlogPost'),
        description: 'Query for a single BlogPost by Id',
        args: {
          data: nonNull(arg({ type: BlogPostByIdInput })),
        },
        resolve: async (_parent, args, context: Context) => {
          return await context.prisma.blogPost.findUnique({
            where: {
              id: args.data.id || undefined,
            },
          })
        },
      })

    t.nonNull.list.nullable.field('blogPostsByUserId', {
      type: nullable('BlogPost'),
      description: 'Query for all BlogPosts that belong to a specific User',
      args: {
        data: nonNull(arg({ type: BlogPostsByUserIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.blogPost.findMany({
          where: {
            authorId: args.data.id,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogPostsByBlogId', {
      type: nullable('BlogPost'),
      description: 'Query for all BlogPosts that belong to a specific Blog',
      args: {
        data: nonNull(arg({ type: BlogPostsByBlogIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.blogPost.findMany({
          where: {
            authorId: args.data.id,
          },
        })
      },
    })
  },
})

export const BlogPostMutations = extendType({
  type: 'Mutation',

  definition(t) {
    // TODO: Add authorization and authentication
    t.nullable.field('createBlogPost', {
      type: nullable('Blog'),

      description: 'Mutation for creating a new BlogPost as a User',

      args: {
        data: nonNull(arg({ type: CreateBlogPostInput })),
      },

      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.blogPost.create({
          data: { ...args.data },
        })
      },
    })

    // TODO: Add authorization and authentication
    t.nullable.field('updateBlogPost', {
      type: 'Blog',

      description: 'Mutation for updating an existing BlogPost as a User',

      args: {
        data: nonNull(arg({ type: UpdateBlogPostInput })),
      },

      resolve: async (parent, args, context: Context) => {
        return await context.prisma.blogPost.update({
          where: {
            id: args.data.id,
          },
          data: { ...args.data, ...parent },
        })
      },
    })
  },
})

export const BlogPostByIdInput = inputObjectType({
  name: 'BlogPostByIdInput',
  description: 'Input arguments for querying BlogPosts by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
    })
  },
})

export const BlogPostsByUserIdInput = inputObjectType({
  name: 'BlogPostsByUserIdInput',
  description:
    'Input arguments for querying BlogPosts by a User Id. Search for the BlogPosts of a specific User',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
      description: 'The Id of the User that the Post belongs to',
    })
  },
})

export const BlogPostsByBlogIdInput = inputObjectType({
  name: 'BlogPostsByBlogIdInput',
  description: 'Input arguments for querying all BlogPosts for a given Blog id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
      description: 'The Id of the Blog that the BlogPost belongs to',
    })
  },
})

// TODO: Add authorization and authentication
export const CreateBlogPostInput = inputObjectType({
  name: 'CreateBlogPostInput',

  description: 'Create a new BlogPost as a User',

  definition(t) {
    t.nonNull.field('authorId', {
      type: 'String',

      description: 'The Id of the User to create the BlogPost as',
    })

    t.nonNull.field('title', {
      type: 'String',

      description: 'The title of the new BlogPost to create',
    })

    t.nonNull.field('content', {
      type: 'String',

      description: 'The content of the new BlogPost to create',
    })

    t.nonNull.field('published', {
      type: 'Boolean',

      description:
        'Whether the BlogPost should be immeadiatly visible to other users',
    })

    t.nonNull.field('blogId', {
      type: 'String',

      description: 'The Id of the Blog to post the BlogPost under',
    })
  },
})

// TODO: Add authorization and authentication
export const UpdateBlogPostInput = inputObjectType({
  name: 'UpdateBlogPostInput',

  description: "Update an existing BlogPost's information",

  definition(t) {
    t.nonNull.field('id', {
      type: 'String',

      description: 'The Id of the BlogPost to update',
    })

    t.nonNull.field('content', {
      type: 'String',

      description: 'The new content of the BlogPost',
    })

    t.nonNull.field('title', {
      type: 'String',

      description: 'The new title of the BlogPost',
    })

    t.nonNull.field('published', {
      type: 'Boolean',

      description: 'Whether the BlogPost should be visible to other Users',
    })
  },
})
