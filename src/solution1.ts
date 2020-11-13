import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import config from '@app/config';
import { ingredients, recipes } from '@app/data';

// Create new express application
const app = express();

// Define graphQl schema
const schema = gql`
  type Query {
    ingredients: [Ingredient!]!
    recipes: [Recipe!]!
  }

  type Recipe {
    id: ID!
    title: String!
    text: String!
  }

  type Ingredient {
    id: ID!
    name: String!
  }
`;

// Resolvers will help us solve the queries
const resolvers = {
  Query: {
    ingredients: () => {
      return ingredients;
    },
    recipes: () => {
      return recipes;
    },
  },
};

// Create new Apollo server, with the previously defined schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

// Connect Apollo (graphQL) server to the Express app
server.applyMiddleware({ app, path: config.GRAPHQL.PATH });

// Start server
app.listen(config.NODE.PORT, () =>
  console.log(`GraphQl server is running on http://localhost:${config.NODE.PORT}/graphql`),
);
