import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { context, Context } from './context'

export const DateTime = asNexusMethod(DateTimeResolver, 'DateTime')

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.field('id', {
      type: nonNull('Int'),
    })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('user', {
      type: User,
      resolve: async (root, args, { prisma }) => {
        const user = await prisma.user.findFirst({
          where: {
            id: root.userId,
          },
        })
        return user
      },
    })
    t.field('userId', {
      type: nonNull('Int'),
    })
    t.string('bio')
  },
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.field('id', {
      type: nonNull('Int'),
    })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('username', {
      type: nonNull('String'),
    })
    t.field('email', {
      type: nonNull('String'),
    })
    t.field('profile', {
      type: Profile,
      resolve: async (root, args, { prisma }) => {
        const profile = await prisma.profile.findFirst({
          where: {
            userId: root.id,
          },
        })
        return profile
      },
    })
    t.list.field('blogs', {
      type: Blog,
      resolve: async (root, args, { prisma }) => {
        const blogs = await prisma.blog.findMany({
          where: {
            authorId: root.id,
          },
        })
        return blogs
      },
    })
    t.list.field('blogPosts', {
      type: BlogPost,
      resolve: async (root, args, { prisma }) => {
        const blogPosts = await prisma.blogPost.findMany({
          where: {
            authorId: root.id,
          },
        })
        return blogPosts
      },
    })
    t.list.nonNull.field('blogComments', {
      type: BlogComment,
      resolve: async (root, args, { prisma }) => {
        const blogComments = await prisma.blogComment.findMany({
          where: {
            authorId: root.id,
          },
        })
        return blogComments
      },
    })
  },
})

export const Blog = objectType({
  name: 'Blog',
  definition(t) {
    t.field('id', {
      type: nonNull('Int'),
    })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('author', {
      type: User,
      resolve: async (root, args, { prisma }) => {
        const user = await prisma.user.findFirst({
          where: {
            id: root.authorId,
          },
        })
        return user
      },
    })
    t.field('authorId', {
      type: nonNull('Int'),
    })
    t.field('name', {
      type: 'String',
    })
    t.string('description')
    t.list.field('blogPosts', {
      type: BlogPost,
      resolve: async (root, args, { prisma }) => {
        const blogs = await prisma.blogPost.findMany({
          where: {
            blogId: root.id,
          },
        })
        return blogs
      },
    })
  },
})

export const BlogPost = objectType({
  name: 'BlogPost',
  definition(t) {
    t.field('id', {
      type: nonNull('Int'),
    })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('author', {
      type: User,
      resolve: async (root, args, { prisma }) => {
        const user = await prisma.user.findFirst({
          where: {
            id: root.authorId,
          },
        })
        return user
      },
    })
    t.field('authorId', {
      type: nonNull('Int'),
    })
    t.field('title', {
      type: 'String',
    })
    t.field('content', {
      type: 'String',
    })
    t.field('published', {
      type: 'Boolean',
    })
    t.field('blog', {
      type: Blog,
      resolve: async (root, args, { prisma }) => {
        const blog = await prisma.blog.findFirst({
          where: {
            id: root.blogId,
          },
        })
        return blog
      },
    })
    t.field('blogId', {
      type: nonNull('Int'),
    })
    t.list.field('blogComments', {
      type: BlogComment,
      resolve: async (root, args, { prisma }) => {
        const blogComments = await prisma.blogComment.findMany({
          where: {
            blogPostId: root.id,
          },
        })
        return blogComments
      },
    })
  },
})

export const BlogComment = objectType({
  name: 'BlogComment',
  definition(t) {
    t.field('id', {
      type: nonNull('Int'),
    })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('author', {
      type: User,
      resolve: async (root, args, { prisma }) => {
        const user = await prisma.user.findFirst({
          where: {
            id: root.authorId,
          },
        })
        return user
      },
    })
    t.field('authorId', {
      type: nonNull('Int'),
    })
    t.field('blogPost', {
      type: BlogPost,
      resolve: async (root, args, { prisma }) => {
        const blogPost = await prisma.blogPost.findFirst({
          where: {
            id: root.blogPostId,
          },
        })
        return blogPost
      },
    })
    t.field('blogPostId', {
      type: nonNull('Int'),
    })
    t.field('content', {
      type: 'String',
    })
    t.nullable.field('parent', {
      type: BlogComment,
      resolve: async (root, args, { prisma }) => {
        if (root.parentId) {
          const blogComment = await prisma.blogComment.findFirst({
            where: {
              id: root.parentId,
            },
          })
          return blogComment
        } else {
          return null
        }
      },
    })
    t.nullable.field('parentId', {
      type: 'Int',
    })
    t.list.field('blogComments', {
      type: BlogComment,
      resolve: async (root, args, { prisma }) => {
        const blogComments = await prisma.blogComment.findMany({
          where: {
            parentId: root.id,
          },
        })
        return blogComments
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
    ],
  },
})
