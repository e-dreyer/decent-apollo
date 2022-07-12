import {
  makeSchema,
  nonNull,
  objectType,
  inputObjectType,
  arg,
  asNexusMethod,
  nullable,
  extendType,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'

export const DateTime = asNexusMethod(DateTimeResolver, 'DateTime')

export const Account = objectType({
  name: 'Account',
  description: `Represents a unique Account created for every User. Stores information regarding the User's login information. Used by NExtAuth.`,
  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK and ID of the Account Entity',
    }),
      /* Entity Specific Fields */
      t.nonNull.field('userId', {
        type: nonNull('String'),
        description: 'Id of the User that the Account belongs to',
      }),
      /* NextAuth Specific Fields */
      t.nonNull.field('type', {
        type: nonNull('String'),
        description: 'Account type. Used by NextAuth',
      }),
      t.nonNull.field('provider', {
        type: nonNull('String'),
        description: 'The Provider of the Account. Used by NextAuth',
      })

    t.nonNull.field('providerAccountId', {
      type: nonNull('String'),
      description: 'The Id of the Provider of the Account. Used by NextAuth',
    }),
      t.nullable.field('refresh_token', {
        type: nullable('String'),
        description: 'The RefreshToken of the Account. Used by NextAuth',
      }),
      t.nullable.field('access_token', {
        type: nullable('String'),
        description: 'The AccessToken of the Account. Used by NextAuth',
      }),
      t.nullable.field('expires_at', {
        type: nullable('Int'),
        description:
          'The time that the AccessToken of the Account expires. Used by NextAuth',
      }),
      t.nullable.field('token_type', {
        type: nullable('String'),
        description:
          'The type of the AccessToken of the Account. Used by NextAuth',
      }),
      t.nullable.field('scope', {
        type: nullable('String'),
        description: 'The scope of the Account. Used by NextAuth',
      }),
      t.nullable.field('id_token', {
        type: nullable('String'),
        description: 'The IdToken of the Account. Used by NextAuth',
      }),
      t.nullable.field('session_state', {
        type: nullable('String'),
        description: 'The SessionState of the Account. Used by NextAuth',
      }),
      /* Relational Fields used by Prisma */
      t.nonNull.field('user', {
        type: nonNull(User),
        description: `Reference to the User that the Account belongs to. Relational field used by Prisma`,
      })
  },
})

export const Session = objectType({
  name: 'Session',
  description: 'Unique Session used by NextAuth',
  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK ID of the Session Entity',
    }),
      /* NextAuth Specific Fields */
      t.nonNull.field('sessionToken', {
        type: nonNull('String'),
        description: 'The SessionToken. Used by NextAuth',
      }),
      t.nonNull.field('userId', {
        type: nonNull('String'),
        description:
          'The Id of the User that the SessionToken belongs to. Used by NextAuth',
      }),
      t.nonNull.field('expires', {
        type: nonNull('DateTime'),
        description: 'Time that the Session expires. Used by NextAuth',
      }),
      /* Relational Fields used by Prisma */
      t.nonNull.field('user', {
        type: nonNull(User),
        description:
          'Reference field to the User that the Session belongs to. Relational field used by Prisma',
      })
  },
})

export const VerificationToken = objectType({
  name: 'VerificationToken',
  description: 'Unique VerificationToken used by NextAuth',
  definition(t) {
    /* NextAuth Specific fields */
    t.nonNull.field('identifier', {
      type: nonNull('String'),
      description: 'The identifier of the VerificationToken. Used by NextAuth',
    }),
      t.nonNull.field('token', {
        type: nonNull('String'),
        description: 'The token of the VerificationToken. Used by NextAuth',
      }),
      t.nonNull.field('expires', {
        type: nonNull('String'),
        description: 'Time that the token expires. Used by NextAuth',
      })
  },
})

export const User = objectType({
  name: 'User',
  description: `Represents a unique User of the App. Stores all information regarding the User. Is derived from the base state of NextAuth and extended with extra fields for added features.`,
  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK and ID of the User Entity',
    })

    t.nonNull.field('createdAt', {
      type: nonNull('DateTime'),
      description: 'Time-stamp of creation as set by Prisma',
    })

    t.nonNull.field('updatedAt', {
      type: nonNull('DateTime'),
      description: 'Time-stamp of last update as set by Prisma',
    })

    /* Entity Specific Fields */
    t.nullable.field('username', {
      type: nonNull('String'),
      description: `Unique human readable username of the User Entity. If the User used a third party service to sign up, this will initially be null`,
    })

    t.nonNull.field('email', {
      type: nonNull('String'),
      description: `Unique email address of the User Entity. If the USer used a third party service to sign up, this will automatically be set and verified by that service`,
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
    }),
      t.nullable.field('image', {
        type: nullable('String'),
        description:
          "URI of the User's profile image as provided by third party services",
      }),
      /* Relational Fields created by Prisma */
      t.nonNull.list.nullable.field('blogs', {
        type: nullable(Blog),
        description: `References to all the Blogs created by the User. This is a relational field created by Prisma`,
        resolve: async (parent, _args, context: Context) => {
          return await context.prisma.blog.findMany({
            where: {
              authorId: parent.id,
            },
          })
        },
      })

    t.nonNull.list.nullable.field('blogPosts', {
      type: nullable(BlogPost),
      description: `References to all the BlogPosts created by the User. This is a relational field created by Prisma`,
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogPost.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogComments', {
      type: nullable(BlogComment),
      description: `References to all the BlogComments created by the User. This is a relational field created by Prisma`,
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogComment.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    }),
      t.nonNull.list.nullable.field('accounts', {
        type: nullable(Account),
        description:
          'Accounts of the User. Relational fields used by both Prisma and NextAuth',
      }),
      t.nonNull.list.nullable.field('sessions', {
        type: nullable(Session),
        description:
          'Sessions that belong to the User. Relational fields used by both Prisma and NextAuth',
      })
  },
})

export const Blog = objectType({
  name: 'Blog',
  description: `Represents a unique Blog of the App created by a User. Stores all information regarding the Blog.`,
  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK and ID of the Blog Entity',
    })

    t.nonNull.field('createdAt', {
      type: nonNull('DateTime'),
      description: 'Time-stamp of creation as set by Prisma',
    })

    t.nonNull.field('updatedAt', {
      type: nonNull('DateTime'),
      description: 'Time-stamp of last update as set by Prisma',
    })

    /* Entity Specific Fields */
    t.nonNull.field('authorId', {
      type: nonNull('String'),
      description: 'The unique Id of the User that created the Blog',
    })

    t.nonNull.field('name', {
      type: nonNull('String'),
      description: 'The unique human readable name of the Blog',
    })

    t.nonNull.field('description', {
      type: nonNull('String'),
      description: `A public human readable and customizable description of the Blog.`,
    })

    /* Relational Fields created by Prisma */
    t.nonNull.field('author', {
      type: nonNull(User),
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
      type: nullable(BlogPost),
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

export const BlogPost = objectType({
  name: 'BlogPost',
  description: `Represents a unique BlogPost of the App created by a User. Stores all information regarding the BlogPost.`,
  definition(t) {
    /* System Fields */
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK and ID of the BlogPost Entity',
    })

    t.nonNull.field('createdAt', {
      type: nonNull('DateTime'),
      description: 'Time-stamp of creation as set by Prisma',
    })

    t.nonNull.field('updatedAt', {
      type: nonNull('DateTime'),
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
    t.nonNull.field('author', {
      type: nonNull(User),
      description: `Reference to the User that created the BlogPost. Relational field created by Prisma.`,
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.user.findFirst({
          where: {
            id: parent.authorId,
          },
        })
      },
    })

    t.nonNull.field('blog', {
      type: nonNull(Blog),
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

    t.nonNull.list.nullable.field('blogComments', {
      type: nullable(BlogComment),
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

export const BlogComment = objectType({
  name: 'BlogComment',
  description: `Represents a unique BlogComment of the App created by a User. Stores all information regarding the BlogComment.`,
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique PK and ID of the BlogComment Entity',
    })

    t.nonNull.field('createdAt', {
      type: nonNull('DateTime'),
      description: 'Time-stamp of creation as set by Prisma',
    })

    t.nonNull.field('updatedAt', {
      type: nonNull('DateTime'),
      description: 'Time-stamp of last update as set by Prisma',
    })

    t.nonNull.field('author', {
      type: nonNull(User),
      description: 'The User that created the BlogComment',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.user.findFirst({
          where: {
            id: parent.authorId,
          },
        })
      },
    })

    t.nonNull.field('authorId', {
      type: nonNull('String'),
      description: 'The Id of the User that created the BlogComment',
    })

    t.nonNull.field('blogPost', {
      type: nonNull(BlogPost),
      description: 'The BlogPost that the BlogComment belongs to',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogPost.findFirst({
          where: {
            id: parent.blogPostId,
          },
        })
      },
    })

    t.nonNull.field('blogPostId', {
      type: nonNull('String'),
      description: 'The Id of the BlogPost that the BlogComment belongs to',
    })

    t.nonNull.field('content', {
      type: nonNull('String'),
      description: 'The User created content of the BlogComment',
    })

    t.nullable.field('parent', {
      type: nonNull(BlogComment),
      description: `The Parent BlogComment of the BlogComment. Can be Null if the BlogComment is a direct reply to the BlogPost and not to a BlogComment.`,
      resolve: async (parent, _args, context: Context) => {
        if (!parent.parentId) {
          return null
        } else {
          return await context.prisma.blogComment.findFirst({
            where: {
              id: parent.parentId,
            },
          })
        }
      },
    })

    t.nullable.field('parentId', {
      type: nullable('String'),
      description: `The Id of the Parent BlogComment. Can be Null if the BlogComment has no Parent.`,
    })

    t.nonNull.list.nullable.field('blogComments', {
      type: nullable(BlogComment),
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

const Query = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nullable.field('allUsers', {
      type: nullable(User),
      description: 'Query all Users',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nonNull.list.nullable.field('allBlogs', {
      type: nullable(Blog),
      description: 'Query all Blogs',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blog.findMany()
      },
    })

    t.nonNull.list.nullable.field('allBlogPosts', {
      type: nullable(BlogPost),
      description: 'Query all BlogPosts',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blogPost.findMany()
      },
    })

    t.nonNull.list.nullable.field('allBlogComments', {
      type: nullable(BlogComment),
      description: 'Query all BlogComments',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blogComment.findMany()
      },
    })

    t.nullable.field('userById', {
      type: nullable(User),
      description: 'Query for a single User by Id',
      args: {
        data: nonNull(arg({ type: UserByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.user.findUnique({
          where: {
            id: args.data.id,
          },
        })
      },
    })

    t.nullable.field('userByEmail', {
      type: nullable(User),
      description: `Query for a single User by Email.`,
      args: {
        data: arg({ type: UserByEmailInput }),
      },
      resolve: async (_parent, args, context: Context) => {
        if (!args.data || !args.data.email) {
          return null
        }

        return context.prisma.user.findUnique({
          where: {
            email: args.data.email,
          },
        })
      },
    })

    t.nullable.field('blogById', {
      type: nullable(Blog),
      description: 'Query for a single Blog by Id',
      args: {
        data: nonNull(arg({ type: BlogByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blog.findUnique({
          where: {
            id: args.data.id || undefined,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogsByUserId', {
      type: nullable(Blog),
      description: 'Query for all Blogs that belong to a specific User',
      args: {
        data: nonNull(arg({ type: BlogsByUserIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blog.findMany({
          where: {
            authorId: args.data.id,
          },
        })
      },
    })

    t.nullable.field('blogPostById', {
      type: nullable(BlogPost),
      description: 'Query for a single BlogPost by Id',
      args: {
        data: nonNull(arg({ type: BlogPostByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogPost.findUnique({
          where: {
            id: args.data.id || undefined,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogPostsByUserId', {
      type: nullable(BlogPost),
      description: 'Query for all BlogPosts that belong to a specific User',
      args: {
        data: nonNull(arg({ type: BlogPostsByUserIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogPost.findMany({
          where: {
            authorId: args.data.id,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogPostsByBlogId', {
      type: nullable(BlogPost),
      description: 'Query for all BlogPosts that belong to a specific Blog',
      args: {
        data: nonNull(arg({ type: BlogPostsByBlogIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogPost.findMany({
          where: {
            authorId: args.data.id,
          },
        })
      },
    })

    t.nullable.field('blogCommentById', {
      type: nullable(BlogComment),
      description: 'Query for a single BlogComment by Id',
      args: {
        data: nonNull(arg({ type: BlogCommentByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogComment.findUnique({
          where: {
            id: args.data.id || undefined,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogCommentsByUserId', {
      type: nullable(BlogComment),
      description: 'Query for all BlogComments that belong to a specific User',
      args: {
        data: nonNull(arg({ type: BlogCommentsByUserIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogComment.findMany({
          where: {
            authorId: args.data.id,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogCommentsByPostId', {
      type: nullable(BlogComment),
      description: `Query for all BlogComments that belong to a specific BlogPost`,
      args: {
        data: nonNull(arg({ type: BlogCommentsByPostIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogComment.findMany({
          where: {
            blogPostId: args.data.id,
          },
        })
      },
    })

    t.nonNull.list.nullable.field('blogCommentsByParentCommentId', {
      type: nullable(BlogComment),
      description: `Query for all BlogComments that belong to a specific Parent BlogComment`,
      args: {
        data: nonNull(arg({ type: BlogCommentsByParentCommentIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogComment.findMany({
          where: {
            parentId: args.data.id,
          },
        })
      },
    })
  },
})

const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('editUser', {
      type: User,
      description: 'Mutation for updating the User',
      args: {
        data: nonNull(arg({ type: UpdateUserByEmailInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        const updatedUser = await context.prisma.user.update({
          where: { email: args.data.email },
          data: { email: args.data.email },
        })

        return updatedUser
      },
    })
  },
})

const UserByIdInput = inputObjectType({
  name: 'UserByIdInput',
  description: 'Input arguments for querying Users by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
    })
  },
})

const UserByEmailInput = inputObjectType({
  name: 'UserByEmailInput',
  description: 'Input arguments for quering Users by Email',
  definition(t) {
    t.nullable.field('email', {
      type: 'String',
    })
  },
})

const UpdateUserByEmailInput = inputObjectType({
  name: 'UpdateUserByEmailInput',
  description: 'Input arguments for mutation a User by referening it by Email',
  definition(t) {
    t.nonNull.field('email', {
      type: 'String',
    }),
      t.nullable.field('username', {
        type: 'String',
      })
  },
})

const BlogByIdInput = inputObjectType({
  name: 'BlogByIdInput',
  description: 'Input arguments for querying Blogs by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
    })
  },
})

const BlogsByUserIdInput = inputObjectType({
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

const BlogPostByIdInput = inputObjectType({
  name: 'BlogPostByIdInput',
  description: 'Input arguments for querying BlogPosts by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
    })
  },
})

const BlogPostsByUserIdInput = inputObjectType({
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

const BlogPostsByBlogIdInput = inputObjectType({
  name: 'BlogPostsByBlogIdInput',
  description: 'Input arguments for querying all BlogPosts for a given Blog id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
      description: 'The Id of the Blog that the BlogPost belongs to',
    })
  },
})

const BlogCommentByIdInput = inputObjectType({
  name: 'BlogCommentByIdInput',
  description: 'Input arguments for querying Blogs by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'String',
    })
  },
})

const BlogCommentsByUserIdInput = inputObjectType({
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

const BlogCommentsByPostIdInput = inputObjectType({
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

const BlogCommentsByParentCommentIdInput = inputObjectType({
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

export const schema = makeSchema({
  types: [
    Query,
    Mutation,

    /* Object Types */
    DateTime,
    User,
    Blog,
    BlogPost,
    BlogComment,

    /* Sorting and Ordering */

    /* User Object Inputs */
    UserByIdInput,

    /* Blog Object Inputs */
    BlogByIdInput,
    BlogsByUserIdInput,

    /* BlogPost Object Inputs */
    BlogPostByIdInput,
    BlogPostsByUserIdInput,
    BlogPostsByBlogIdInput,

    /* BlogComment Object Inputs */
    BlogCommentByIdInput,
    BlogCommentsByUserIdInput,
    BlogCommentsByPostIdInput,
    BlogCommentsByParentCommentIdInput,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})
