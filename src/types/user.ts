import {
  nonNull,
  objectType,
  nullable,
  extendType,
  arg,
  inputObjectType,
} from 'nexus'
import { Context } from '../context'

export const User = objectType({
  name: 'User',

  description: `Represents a unique User of the App. Stores all information regarding the User. Is derived from the base state of NextAuth and extended with extra fields for added features.`,

  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),

      description: 'Unique PK and ID of the User Entity',
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
    t.nullable.field('username', {
      type: nullable('String'),

      description: `Unique human readable username of the User Entity. If the User used a third party service to sign up, this will initially be null`,
    })

    t.nullable.field('email', {
      type: nullable('String'),

      description: `Unique email address of the User Entity. If the USer used a third party service to sign up, this will automatically be set and verified by that service`,
    })

    t.nullable.field('bio', {
      type: nullable('String'),

      description: 'User customizable and human readable bio of the User',
    })

    /* NextAuth Specific Fields */
    t.nullable.field('name', {
      type: nullable('String'),

      description:
        'The name of the User. Provided by third party login services. Used by NextAuth',
    })

    t.nullable.field('emailVerified', {
      type: nullable('DateTime'),

      description: "DateTime of when the User's email was verified",
    })

    t.nullable.field('image', {
      type: nullable('String'),

      description:
        "URI of the User's profile image as provided by third party services",
    })

    /* Relational Fields created by Prisma */
    t.list.field('blogs', {
      type: 'Blog',

      description: `References to all the Blogs created by the User. This is a relational field created by Prisma`,

      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blog.findMany({
          where: {
            authorId: parent.id,
          },

          include: {
            author: true,
            blogPosts: true,
          },
        })
      },
    })

    t.list.field('blogPosts', {
      type: 'BlogPost',

      description: `References to all the BlogPosts created by the User. This is a relational field created by Prisma`,

      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogPost.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    })

    t.list.field('blogComments', {
      type: 'BlogComment',

      description: `References to all the BlogComments created by the User. This is a relational field created by Prisma`,

      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogComment.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    })

    t.list.field('accounts', {
      type: 'Account',

      description:
        'Accounts of the User. Relational fields used by both Prisma and NextAuth',
    })

    t.list.field('sessions', {
      type: 'Session',

      description:
        'Sessions that belong to the User. Relational fields used by both Prisma and NextAuth',
    })
  },
})

export const UserQueries = extendType({
  type: 'Query',

  definition(t) {
    t.nullable.list.nullable.field('allUsers', {
      type: nullable('User'),

      description: 'Query all User',

      resolve: async (_parent, _args, context: Context) => {
        return await context.prisma.user.findMany()
      },
    })

    t.nullable.field('userById', {
      type: nullable('User'),

      description: 'Query for a single User by Id',

      args: {
        data: nonNull(arg({ type: UserByIdInput })),
      },

      resolve: async (_parent, args, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: args.data.id,
          },
        })
      },
    })

    t.nullable.field('userByEmail', {
      type: nullable('User'),

      description: `Query for a single User by Email.`,

      args: {
        data: arg({ type: UserByEmailInput }),
      },

      resolve: async (_parent, args, context: Context) => {
        if (!args.data || !args.data.email) {
          throw Error('userByEmail: email is null')
        }

        return await context.prisma.user.findUnique({
          where: {
            email: args.data.email,
          },
        })
      },
    })

    t.nullable.field('userByUsername', {
      type: nullable('User'),

      description: `Query for a single User by Username`,

      args: {
        data: arg({ type: UserByUsernameInput }),
      },

      resolve: async (_parent, args, context: Context) => {
        if (!args.data || !args.data.username) {
          throw Error('userByUsername: username is null')
        }

        return await context.prisma.user.findUnique({
          where: {
            username: args.data.username,
          },
        })
      },
    })
  },
})

export const UserMutations = extendType({
  type: 'Mutation',

  definition(t) {
    t.nullable.field('updateUser', {
      type: nullable('User'),

      description: 'Mutation for updating a User',

      args: {
        data: nonNull(arg({ type: UpdateUserInput })),
      },

      resolve: async (parent, args, context: Context) => {
        return await context.prisma.user.update({
          where: { id: args.data.id },
          data: { ...args, ...parent },
        })
      },
    })
  },
})

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',

  description: 'Input arguments for mutation a User',

  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('String'),
    })

    t.nonNull.field('bio', {
      type: nonNull('String'),
    })
  },
})

export const UserByIdInput = inputObjectType({
  name: 'UserByIdInput',

  description: 'Input arguments for querying Users by Id',

  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
    })
  },
})

export const UserByEmailInput = inputObjectType({
  name: 'UserByEmailInput',

  description: 'Input arguments for querying Users by Email',

  definition(t) {
    t.nullable.field('email', {
      type: 'String',
    })
  },
})

export const UserByUsernameInput = inputObjectType({
  name: 'UserByUsernameInput',

  description: 'Input arguments for querying Users by Username',

  definition(t) {
    t.nullable.field('username', {
      type: 'String',
    })
  },
})
