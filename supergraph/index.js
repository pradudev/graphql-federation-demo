import { ApolloServer } from '@apollo/server'
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway'
import { startStandaloneServer } from '@apollo/server/standalone'


const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "users", url: "http://localhost:4001" }, 
      { name: "products", url: "http://localhost:4002" }
       // List of federation-capable GraphQL endpoints...
    ],
  }),
});

const server = new ApolloServer({ gateway });

startStandaloneServer(server, { listen: { port: 4000 } }).then(({ url }) => {
  console.log(`SuperGraph Gateway running at ${url}`);
});