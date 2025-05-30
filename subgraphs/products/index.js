import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { buildSubgraphSchema } from '@apollo/subgraph'
import { readFileSync } from "node:fs";
import path from 'node:path'
import { getCurrentModulePath } from '../../utils.js';
import { gql } from 'graphql-tag'
// import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

try {
  console.log(process.env.NODE_ENV);
  const schemaPath = path.join(getCurrentModulePath(import.meta.url), 'schema.graphql');
  console.log(`Loading schema from ${schemaPath}`);

  const typeDefs = readFileSync(schemaPath, 'utf8');

  const getProducts = () => {
    const data = readFileSync(path.join(getCurrentModulePath(import.meta.url), 'products.json'), 'utf8');
    return JSON.parse(data);
  }

  const resolvers = {
    Query: {
      products: () => getProducts(),
      product: (_, { id }) => getProducts().find(product => product.id === id),
    },
  };

  const schema = buildSubgraphSchema([{ typeDefs: gql(typeDefs), resolvers }]);
  const server = new ApolloServer({
    schema: schema,
    introspection: true,
    // plugins: [
    //   ApolloServerPluginCacheControl({
    //     defaultMaxAge: 0,
    //     calculateHttpHeaders: false,
    //   }),
    // ],
    // introspection: process.env.NODE_ENV !== 'production',
    // hideSchemaDetailsFromClientErrors: process.env.NODE_ENV === 'production',
    // includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
    //nodeEnv: 'production'
  });

  startStandaloneServer(server, { 
    listen: { host: '0.0.0.0', port: 4002 },
    context: async ({ req, res }) => {
      // add custom headers or context here
      res.setHeader('X-SUBGRAPHS', 'products-subgraph');
      return {};
    }
  }).then(({ url }) => {
    console.log(`🚀 Products SubGraph running at ${url}`);
  });
} catch (error) {
  console.error("Error starting subgraph:", error);
}
