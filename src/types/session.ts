import { nonNull, objectType } from 'nexus'

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
      t.field('expires', {
        type: 'DateTime',
        description: 'Time that the Session expires. Used by NextAuth',
      }),
      /* Relational Fields used by Prisma */
      t.field('user', {
        type: 'User',
        description:
          'Reference field to the User that the Session belongs to. Relational field used by Prisma',
      })
  },
})
