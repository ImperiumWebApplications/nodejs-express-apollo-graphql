const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const axios = require("axios");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Todo {
    userId: Int
    id: Int
    title: String
    completed: Boolean
  }

  type Query {
    todos: [Todo]
  }
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    todos: async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos"
        );
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer(typeDefs, resolvers);
