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
    ingredient(id: ID!): Ingredient
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
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
    // put the names of the query parameters on the second parameter (with curly brackets)
    ingredient: (_: any, { id }: any) => {
      // perform a check on the id of each ingredient in the array, if the check is true then return the ingredient data
      return ingredients.find((ingredient) => ingredient.id === Number.parseInt(id, 10));
    },
    recipes: () => {
      return recipes;
    },
    recipe: (_: any, { id }: any) => {
      return recipes.find((recipe) => recipe.id === Number.parseInt(id, 10));
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
