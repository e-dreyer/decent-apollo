import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { context } from './context'

const server = new ApolloServer({
  schema: schema,
  context: context,
})

server.listen( process.env.PORT || 3001, '0.0.0.0', () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});