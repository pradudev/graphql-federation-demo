import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { readFileSync } from "fs";
import path from 'node:path'
import { getCurrentModulePath } from '../../utils.js';
import { gql } from 'graphql-tag'
import { get } from 'node:http';

const schemaPath = path.join(getCurrentModulePath(import.meta.url), 'schema.graphql');
console.log(`Loading schema from ${schemaPath}`);

const typeDefs = readFileSync(schemaPath, 'utf8');

const getUsers = () => {
    const data = readFileSync(path.join(getCurrentModulePath(import.meta.url), 'users.json'), 'utf8');
    return JSON.parse(data);
  }

const resolvers = {
  Query: {
    users: () => getUsers(),
    user: (_, { id }) => getUsers().find(user => user.id === id),
  },
};


const schema = buildSubgraphSchema([{ typeDefs: gql(typeDefs), resolvers }]);
const server = new ApolloServer({
  schema: schema,
  introspection: true
});

startStandaloneServer(server, { 
  listen: { host: '0.0.0.0', port: 4001 },
  context: async ({ req, res }) => {
      // add custom headers or context here
      res.setHeader('X-SUBGRAPHS', 'users-subgraph');
      return {};
    } 
}).then(({ url }) => {
  console.log(`🚀 Users SubGraph running at ${url}`);
});