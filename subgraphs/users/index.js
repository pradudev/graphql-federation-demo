import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { readFileSync } from "fs";
import path from 'node:path'
import { getCurrentModulePath } from '../../utils.js';
import { gql } from 'graphql-tag'

const schemaPath = path.join(getCurrentModulePath(import.meta.url), 'schema.graphql');
console.log(`Loading schema from ${schemaPath}`);

const typeDefs = readFileSync(schemaPath, 'utf8');

const users = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
]

const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(users => users.id === id),
  },
};


const schema = buildSubgraphSchema([{ typeDefs: gql(typeDefs), resolvers }]);
const server = new ApolloServer({
  schema: schema,
  introspection: true
});

startStandaloneServer(server, { listen: { host: '0.0.0.0', port: 4001 } }).then(({ url }) => {
  console.log(`🚀 Users SubGraph running at ${url}`);
});