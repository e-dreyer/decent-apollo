import {
  makeSchema,
  nonNull,
  objectType,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
  nullable,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'

export const DateTime = asNexusMethod(DateTimeResolver, 'DateTime')

export const Profile = objectType({
  name: 'Profile',
  description: `Stores information regarding a User. Each User can only have one Profile.`,
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique Id of the Profile',
    })
    t.nonNull.field('createdAt', {
      type: 'DateTime',
      description: 'Time of creation',
    })
    t.nonNull.field('updatedAt', {
      type: 'DateTime',
      description: 'Time of last update',
    })
    t.nullable.field('user', {
      type: nullable(User),
      description: 'The unique User that the Profile belongs to',
      resolve: async (parent, _args, context: Context) => {
        if (parent.userId) {
          return await context.prisma.user.findUnique({
            where: {
              id: parent.userId,
            },
          })
        } else {
          return null
        }
      },
    })
    t.nonNull.field('userId', {
      type: nullable('String'),
      description: 'Unique Id of the User that the Profile belongs to',
    })
    t.nonNull.field('bio', {
      type: 'String',
      description: `A customizable personal message or description a User can display publicly on their Profile.`,
    })
  },
})

export const User = objectType({
  name: 'User',
  description: `Represents a unique User of the App. The User is used as reference of ownership for all other Objects.`,
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'Unique Id of the User',
    })
    t.nonNull.field('createdAt', {
      type: 'DateTime',
      description: 'Time of creation',
    })
    t.nonNull.field('updatedAt', {
      type: 'DateTime',
      description: 'Time of last update',
    })
    t.nullable.field('username', {
      type: nullable('String'),
      description: 'Unique human readable username of the User',
    })
    t.nonNull.field('email', {
      type: nonNull('String'),
      description: 'Unique email address of the User',
    })
    t.field('profile', {
      type: nullable(Profile),
      description: 'The Profile that belongs to the User',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.profile.findFirst({
          where: {
            userId: parent.id,
          },
        })
      },
    })
    t.list.field('blogs', {
      type: Blog,
      description: 'All Blogs that the User created and belongs to them',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blog.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    })
    t.nonNull.list.field('blogPosts', {
      type: nullable(BlogPost),
      description: 'All BlogPosts that the User created and belongs to them',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogPost.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    })
    t.nonNull.list.field('blogComments', {
      type: nullable(BlogComment),
      description: 'All BlogComments that the User created and belongs to them',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blogComment.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    })
  },
})

export const Blog = objectType({
  name: 'Blog',
  description: `Represents a topic or group of related BlogPosts. All BlogPosts are stored under a certain Blog.`,
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'The unique Id of the Blog',
    })
    t.nonNull.field('createdAt', {
      type: 'DateTime',
      description: 'Time of creation',
    })
    t.nonNull.field('updatedAt', {
      type: 'DateTime',
      description: 'Time of last update',
    })
    t.field('author', {
      type: User,
      description: 'The User that created the Blog',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: parent.authorId,
          },
        })
      },
    })
    t.nonNull.field('authorId', {
      type: 'String',
      description: 'The unique Id of the User that created the Blog',
    })
    t.nonNull.field('name', {
      type: 'String',
      description: 'The unique human readable name of the Blog',
    })
    t.field('description', {
      type: 'String',
      description: `A public human readable and customizable description of the Blog.`,
    })
    t.nonNull.list.field('blogPosts', {
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
  description: `Represents a User created BlogPost that belongs to a User and a Blog.`,
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'The unique Id of the BlogPost',
    })
    t.nonNull.field('createdAt', {
      type: 'DateTime',
      description: 'Time of creation',
    })
    t.nonNull.field('updatedAt', {
      type: 'DateTime',
      description: 'Time of last update',
    })
    t.field('author', {
      type: User,
      description: 'The unique User that created the BlogPost',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.user.findFirst({
          where: {
            id: parent.authorId,
          },
        })
      },
    })
    t.nonNull.field('authorId', {
      type: 'String',
      description: `The unique Id of the User that created the BlogPost.`,
    })
    t.nonNull.field('title', {
      type: 'String',
      description: 'The human readable Title set by the User',
    })
    t.field('content', {
      type: 'String',
      description: 'The human readable Content set by the User',
    })
    t.nonNull.field('published', {
      type: 'Boolean',
      description: `Boolean value of whether the User has published the BlogPost and want it to be shown publicly.`,
    })
    t.field('blog', {
      type: Blog,
      description: 'The Blog that the BlogPost belongs to',
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.blog.findFirst({
          where: {
            id: parent.blogId,
          },
        })
      },
    })
    t.field('blogId', {
      type: nonNull('String'),
      description: 'The Id of the Blog that the BlogPost belongs to',
    })
    t.nonNull.list.field('blogComments', {
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
  description: 'User created replies to BlogPosts or other BlogComments',
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('String'),
      description: 'The unique Id of the BlogComment',
    })
    t.nonNull.field('createdAt', {
      type: 'DateTime',
      description: 'Time of creation',
    })
    t.nonNull.field('updatedAt', {
      type: 'DateTime',
      description: 'Time of last update',
    })
    t.field('author', {
      type: User,
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
    t.field('blogPost', {
      type: BlogPost,
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
      type: 'String',
      description: 'The Id of the BlogPost that the BlogComment belongs to',
    })
    t.field('content', {
      type: 'String',
      description: 'The User created content of the BlogComment',
    })
    t.nullable.field('parent', {
      type: BlogComment,
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
    t.field('parentId', {
      type: 'String',
      description: `The Id of the Parent BlogComment. Can be Null if the BlogComment has no Parent.`,
    })
    t.nonNull.list.field('blogComments', {
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

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('allUsers', {
      type: User,
      description: 'Query all Users',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.list.field('allProfiles', {
      type: Profile,
      description: 'Query all Profiles',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.profile.findMany()
      },
    })

    t.list.field('allBlogs', {
      type: Blog,
      description: 'Query all Blogs',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blog.findMany()
      },
    })

    t.list.field('allBlogPosts', {
      type: BlogPost,
      description: 'Query all BlogPosts',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blogPost.findMany()
      },
    })

    t.list.field('allBlogComments', {
      type: BlogComment,
      description: 'Query all BlogComments',
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.blogComment.findMany()
      },
    })

    t.nullable.field('userById', {
      type: nullable(User),
      description: 'Query for a single User by Id',
      args: {
        userByIdInput: nonNull(arg({ type: UserByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.user.findUnique({
          where: {
            id: args.userByIdInput.id || undefined,
          },
        })
      },
    })

    t.field('profileById', {
      type: Profile,
      description: 'Query for a single Profile by Id',
      args: {
        data: nonNull(arg({ type: ProfileByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.profile.findUnique({
          where: {
            id: args.data.id || undefined,
          },
        })
      },
    })

    t.field('blogById', {
      type: Blog,
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

    t.list.field('blogsByUserId', {
      type: Blog,
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

    t.field('blogPostById', {
      type: BlogPost,
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

    t.list.field('blogPostsByUserId', {
      type: BlogPost,
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

    t.list.field('blogPostsByBlogId', {
      type: BlogPost,
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

    t.field('blogCommentById', {
      type: BlogComment,
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

    t.list.field('blogCommentsByUserId', {
      type: BlogComment,
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

    t.list.field('blogCommentsByPostId', {
      type: BlogComment,
      description:
        'Query for all BlogComments that belong to a specific BlogPost',
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

    t.list.field('blogCommentsByParentCommentId', {
      type: BlogComment,
      description:
        'Query for all BlogComments that belong to a specific Parent BlogComment',
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

const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
})

const PostOrderById = inputObjectType({
  name: 'PostOrderById',
  definition(t) {
    t.field('id', { type: SortOrder })
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
    t.nonNull.field('email', {
      type: 'String',
    })
  },
})

const ProfileByIdInput = inputObjectType({
  name: 'ProfileByIdInput',
  description: 'Input arguments for querying Profiles by Id',
  definition(t) {
    t.nonNull.field('id', {
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
      description:
        'The Id of the Parent BlogComment of the BlogComment to search for',
    })
  },
})

export const schema = makeSchema({
  types: [
    Query,

    /* Object Types */
    DateTime,
    Profile,
    User,
    Blog,
    BlogPost,
    BlogComment,

    /* Sorting and Ordering */
    SortOrder,
    PostOrderById,

    /* User Object Inputs */
    UserByIdInput,
    ProfileByIdInput,

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
      {
        module: __dirname + '/db.ts',
        alias: 'db',
        typeMatch(type) {
          return new RegExp(
            `(?:interface|type|class|enum)\\s+(${type.name}Model)\\W`,
            'g',
          )
        },
      },
    ],
  },
})
