import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { readFileSync } from "fs";
import path from 'node:path'
import { getCurrentModulePath } from '../../utils.js';
import { gql } from 'graphql-tag'

try {
  console.log(process.env.NODE_ENV);
  const schemaPath = path.join(getCurrentModulePath(import.meta.url), 'schema.graphql');
  console.log(`Loading schema from ${schemaPath}`);

  const typeDefs = readFileSync(schemaPath, 'utf8');

  const products = [
    { id: "101", name: "Laptop", price: 999.99 },
    { id: "102", name: "Smartphone", price: 499.99 },
  ]

  const resolvers = {
    Query: {
      products: () => products,
      product: (_, { id }) => products.find(product => product.id === id),
    },
  };

  const schema = buildSubgraphSchema([{ typeDefs: gql(typeDefs), resolvers }]);
  const server = new ApolloServer({
    schema: schema,
    introspection: true,
    // introspection: process.env.NODE_ENV !== 'production',
    // hideSchemaDetailsFromClientErrors: process.env.NODE_ENV === 'production',
    // includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
    //nodeEnv: 'production'
  });

  startStandaloneServer(server, { listen: { host: '0.0.0.0', port: 4002 } }).then(({ url }) => {
    console.log(`🚀 Products SubGraph running at ${url}`);
  });
} catch (error) {
  console.error("Error starting subgraph:", error);
}
