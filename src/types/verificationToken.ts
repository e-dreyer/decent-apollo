import { nonNull, objectType } from 'nexus'

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
