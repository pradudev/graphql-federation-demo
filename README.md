# graphql-federation-demo
* This is sample implementation of Apollo SuperGraph/SubGraph in Node.js.
* The supergraph can be hosted either using Apollo Gateway (NPM package) or using Apollo Router (standalone binary)
* This sample application can be run with Apollo Studio (GraphOS) for Schema management or it can be run offline as well

## using Apollo Gateway
### Offline (without Apollo GraphOS)
* Run `./supergraph-apollo-gateway/index-offline.js` to start the gateway on port 4000.
* The gateway will have list of the subgraphs for the federation

### Online (with Apollo GraphOS)
* Run `./supergraph-apollo-gateway/index-online.js` to start the gateway on port 4000.
* The gateway will dynamically fetch composed supergraph schema from ApolloStudio
* We need to provide `APOLLO_KEY` and `APOLLO_GRAPH_REF` ENV vars for authentication with Apollo Studio
* Refer to publish subgraphs to Apollo Studio

## using Apollo Router
### Offline
* We should prepare supergraph config YAML that should list all the subgraphs and their endpoints
* Router config is a YAML file which will config router behaviour
* Use Rover CLI to run router or direct Router binary or docker container
```
rover dev \
  --supergraph-config supergraph-config.yaml \
  --router-config router-config.yaml
```

### Online (GraphOS)
* Router will connect to the Apollo GraphOS and will fecth the supergraph schema automatically
* Run router as a docker conatiner
```
docker run -p 4000:4000 \
  --env APOLLO_GRAPH_REF="BigW-POC@current" \
  --env APOLLO_KEY="service:BigW-POC:V89xsGoDG98gJtD7W91-Kg" \
  --mount "type=bind,source=/Users/prado/personal/projects/graphql-federation-demo/router-config.yaml,target=/dist/config/router.yaml" \
  --rm \
  ghcr.io/apollographql/router:v2.1.1
```

# Publish subgraphs to Apollo Studio (GraphOS)
* The Apollo Gateway or the Apollo router must have a network connectivity to the subgraphs
* Either host the subgraphs on public IPs or host them on private IPs in the same network domain as gateway/router
* Apollo Studio does not need connectivity to the subgraphs
* For running supergraph/subgraphs locally
    * Using Apollo Gateway: run and publish subgraphs on host `localhost` or `0.0.0.0`
    * Using Apollo Router (as a Docker container in WSL2 or MacOS): run subgraphs on host `0.0.0.0` and publish subgraphs on host `host.docker.internal`. This is to make sure router container can connect to subgraphs running on docker host

## export the `APOLLO_KEY`
`export APOLLO_KEY=service:BigW-POC:V89xsGoDG98gJtD7W91-Kg`

## Publish Products subgraph using Rover CLI
```
rover subgraph publish BigW-POC@current \
  --schema ./subgraphs/products/schema.graphql \
  --name products-subgraph \
  --routing-url http://host.docker.internal:4002/
```

## Publish Users subgraph using Rover CLI
```
rover subgraph publish BigW-POC@current \
  --schema ./subgraphs/users/schema.graphql \
  --name users-subgraph \
  --routing-url http://host.docker.internal:4001/
```
