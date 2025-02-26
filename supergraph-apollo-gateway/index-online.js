import { ApolloServer } from '@apollo/server'
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway'
import { startStandaloneServer } from '@apollo/server/standalone'

// Load Apollo Studio API Key from environment variables
const APOLLO_KEY = process.env.APOLLO_KEY;
const APOLLO_GRAPH_REF = process.env.APOLLO_GRAPH_REF;

if (!APOLLO_KEY || !APOLLO_GRAPH_REF) {
  console.error("❌ Missing APOLLO_KEY or APOLLO_GRAPH_REF");
  process.exit(1);
}

// Create Apollo Gateway with no supergraphSdl option
// This will cause the gateway to fetch the supergraph schema from Apollo Studio
const gateway = new ApolloGateway();

const server = new ApolloServer({ gateway });

startStandaloneServer(server, { listen: { port: 4000 } }).then(({ url }) => {
  console.log(`🚀 SuperGraph Gateway running at ${url}`);
});