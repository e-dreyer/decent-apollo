import { nonNull, objectType, nullable } from 'nexus'
import { Context } from '../context'

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
      t.field('user', {
        type: 'User',
        description: `Reference to the User that the Account belongs to. Relational field used by Prisma`,
        resolve: async (parent, _args, context: Context) => {
          return await context.prisma.user.findUnique({
            where: {
              id: parent.userId,
            },
          })
        },
      })
  },
})
