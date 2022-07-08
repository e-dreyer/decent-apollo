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
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('Int'),
    })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.field('user', {
      type: nullable(User),
      resolve: async (parent, _args, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: parent.userId,
          },
        })
      },
    })
    t.nonNull.field('userId', {
      type: nullable('Int'),
    })
    t.nonNull.string('bio')
  },
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('Int'),
    })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.field('username', {
      type: nonNull('String'),
    })
    t.nonNull.field('email', {
      type: nonNull('String'),
    })
    t.field('profile', {
      type: nullable(Profile),
      resolve: async (parent, args, context: Context) => {
        return await context.prisma.profile.findFirst({
          where: {
            userId: parent.id,
          },
        })
      },
    })
    t.list.field('blogs', {
      type: Blog,
      resolve: async (parent, args, context: Context) => {
        return await context.prisma.blog.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    })
    t.nonNull.list.field('blogPosts', {
      type: nullable(BlogPost),
      resolve: async (parent, args, context: Context) => {
         return await context.prisma.blogPost.findMany({
          where: {
            authorId: parent.id,
          },
        })
      },
    })
    t.nonNull.list.field('blogComments', {
      type: nullable(BlogComment),
      resolve: async (parent, args, context: Context) => {
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
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('Int'),
    })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.field('author', {
      type: User,
      resolve: async (parent, args, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: parent.authorId,
          },
        })
      },
    })
    t.nonNull.field('authorId', {
      type: 'Int',
    })
    t.nonNull.field('name', {
      type: 'String',
    })
    t.field('description',{
      type: 'String'
    })
    t.nonNull.list.field('blogPosts', {
      type: nullable(BlogPost),
      resolve: async (parent, args, context: Context) => {
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
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('Int'),
    })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.field('author', {
      type: User,
      resolve: async (parent, args, context: Context) => {
        return await context.prisma.user.findFirst({
          where: {
            id: parent.authorId,
          },
        })
      },
    })
    t.nonNull.field('authorId', {
      type: 'Int',
    })
    t.nonNull.field('title', {
      type: 'String',
    })
    t.field('content', {
      type: 'String',
    })
    t.nonNull.field('published', {
      type: 'Boolean',
    })
    t.field('blog', {
      type: Blog,
      resolve: async (parent, args, context: Context) => {
        return await context.prisma.blog.findFirst({
          where: {
            id: parent.blogId,
          },
        })
      },
    })
    t.field('blogId', {
      type: nonNull('Int'),
    })
    t.nonNull.list.field('blogComments', {
      type: nullable(BlogComment),
      resolve: async (parent, args, context: Context) => {
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
  definition(t) {
    t.nonNull.field('id', {
      type: nonNull('Int'),
    })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.field('author', {
      type: User,
      resolve: async (parent, args, context: Context) => {
        return await context.prisma.user.findFirst({
          where: {
            id: parent.authorId,
          },
        })
      },
    })
    t.nonNull.field('authorId', {
      type: nonNull('Int'),
    })
    t.field('blogPost', {
      type: BlogPost,
      resolve: async (parent, args, context: Context) => {
        return await context.prisma.blogPost.findFirst({
          where: {
            id: parent.blogPostId,
          },
        })
      },
    })
    t.nonNull.field('blogPostId', {
      type: 'Int',
    })
    t.field('content', {
      type: 'String',
    })
    t.nullable.field('parent', {
      type: BlogComment,
      resolve: async (parent, args, context: Context) => {
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
    t.field('parentId', {
      type: 'Int',
    })
    t.nonNull.list.field('blogComments', {
      type: nullable(BlogComment),
      resolve: async (parent, args, context: Context) => {
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

    t.field('userById', {
      type: User,
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
        profileByIdInput: nonNull(arg({ type: ProfileByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.profile.findUnique({
          where: {
            id: args.profileByIdInput.id || undefined,
          },
        })
      },
    })

    t.field('blogById', {
      type: Blog,
      description: 'Query for a single Blog by Id',
      args: {
        blogByIdInput: nonNull(arg({ type: BlogByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blog.findUnique({
          where: {
            id: args.blogByIdInput.id || undefined,
          },
        })
      },
    })

    t.list.field('blogsByUserId', {
      type: Blog,
      description: 'Query for all Blogs that belong to a specific User',
      args: {
        blogsByUserIdInput: nonNull(arg({ type: BlogsByUserIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blog.findMany({
          where: {
            authorId: args.blogsByUserIdInput.userId,
          },
        })
      },
    })

    t.field('blogPostById', {
      type: BlogPost,
      description: 'Query for a single BlogPost by Id',
      args: {
        blogPostByIdInput: nonNull(arg({ type: BlogPostByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogPost.findUnique({
          where: {
            id: args.blogPostByIdInput.id || undefined,
          },
        })
      },
    })

    t.list.field('blogPostsByUserId', {
      type: BlogPost,
      description: 'Query for all BlogPosts that belong to a specific User',
      args: {
        blogPostsByUserIdInput: nonNull(arg({ type: BlogPostsByUserIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogPost.findMany({
          where: {
            authorId: args.blogPostsByUserIdInput.userId,
          },
        })
      },
    })

    t.list.field('blogPostsByBlogId', {
      type: BlogPost,
      description: 'Query for all BlogPosts that belong to a specific Blog',
      args: {
        blogPostsByBlogIdInput: nonNull(arg({ type: BlogPostsByBlogIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogPost.findMany({
          where: {
            authorId: args.blogPostsByBlogIdInput.blogId,
          },
        })
      },
    })

    t.field('blogCommentById', {
      type: BlogComment,
      description: 'Query for a single BlogComment by Id',
      args: {
        blogCommentByIdInput: nonNull(arg({ type: BlogCommentByIdInput })),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogComment.findUnique({
          where: {
            id: args.blogCommentByIdInput.id || undefined,
          },
        })
      },
    })

    t.list.field('blogCommentsByUserId', {
      type: BlogComment,
      description: 'Query for all BlogComments that belong to a specific User',
      args: {
        blogCommentsByUserIdInput: nonNull(
          arg({ type: BlogCommentsByUserIdInput }),
        ),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogComment.findMany({
          where: {
            authorId: args.blogCommentsByUserIdInput.userId,
          },
        })
      },
    })

    t.list.field('blogCommentsByPostId', {
      type: BlogComment,
      description:
        'Query for all BlogComments that belong to a specific BlogPost',
      args: {
        blogCommentsByPostIdInput: nonNull(
          arg({ type: BlogCommentsByPostIdInput }),
        ),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogComment.findMany({
          where: {
            blogPostId: args.blogCommentsByPostIdInput.postId,
          },
        })
      },
    })

    t.list.field('blogCommentsByParentCommentId', {
      type: BlogComment,
      description:
        'Query for all BlogComments that belong to a specific Parent BlogComment',
      args: {
        blogCommentsByParentCommentIdInput: nonNull(
          arg({ type: BlogCommentsByParentCommentIdInput }),
        ),
      },
      resolve: async (_parent, args, context: Context) => {
        return context.prisma.blogComment.findMany({
          where: {
            parentId: args.blogCommentsByParentCommentIdInput.parentId,
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
  description: 'Input arguments for quering Users by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int',
    })
  },
})

const ProfileByIdInput = inputObjectType({
  name: 'ProfileByIdInput',
  description: 'Input arguments for quering Profiles by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int',
    })
  },
})

const BlogByIdInput = inputObjectType({
  name: 'BlogByIdInput',
  description: 'Input arguments for quering Blogs by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int',
    })
  },
})

const BlogsByUserIdInput = inputObjectType({
  name: 'BlogsByUserIdInput',
  description:
    'Input arguments for quering Blogs by User Id. Search for the Blogs of a specific User',
  definition(t) {
    t.nonNull.field('userId', {
      type: 'Int',
      description: 'The Id of the User that the Blogs belongs to',
    })
  },
})

const BlogPostByIdInput = inputObjectType({
  name: 'BlogPostByIdInput',
  description: 'Input arguments for quering BlogPosts by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int',
    })
  },
})

const BlogPostsByUserIdInput = inputObjectType({
  name: 'BlogPostsByUserIdInput',
  description:
    'Input arguments for quering BlogPosts by a User Id. Search for the BlogPosts of a specific User',
  definition(t) {
    t.nonNull.field('userId', {
      type: 'Int',
      description: 'The Id of the User that the Post belongs to',
    })
  },
})

const BlogPostsByBlogIdInput = inputObjectType({
  name: 'BlogPostsByBlogIdInput',
  description: 'Input arguments for quering all BlogPosts for a given Blog id',
  definition(t) {
    t.nonNull.field('blogId', {
      type: 'Int',
      description: 'The Id of the Blog that the BlogPost belongs to',
    })
  },
})

const BlogCommentByIdInput = inputObjectType({
  name: 'BlogCommentByIdInput',
  description: 'Input arguments for quering Blogs by Id',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int',
    })
  },
})

const BlogCommentsByUserIdInput = inputObjectType({
  name: 'BlogCommentsByUserIdInput',
  description:
    'Input arguments for quering BlogComments by User Id. Search for BlogComments of a specific User',
  definition(t) {
    t.nonNull.field('userId', {
      type: 'Int',
      description: 'The Id of the User that the BlogComment belongs to',
    })
  },
})

const BlogCommentsByPostIdInput = inputObjectType({
  name: 'BlogCommentsByPostIdInput',
  description:
    'Input arguments for quering BlogComments by BlogPost Id. Search for the BlogComments of a specific BlogPost',
  definition(t) {
    t.nonNull.field('postId', {
      type: 'Int',
      description: 'The Id of the BlogPost that the BlogComments belongs to',
    })
  },
})

const BlogCommentsByParentCommentIdInput = inputObjectType({
  name: 'BlogCommentsByParentCommentIdInput',
  description:
    'Input arguments for quering BlogComments by their Parent BlogComment Id. Search for the BlogComments that replied to a specific BlogComment',
  definition(t) {
    t.nonNull.field('parentId', {
      type: 'Int',
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
        typeMatch(type, defaultRegex) {
          return new RegExp(
            `(?:interface|type|class|enum)\\s+(${type.name}Model)\\W`,
            'g',
          )
        }
      }
    ],
  },
})
