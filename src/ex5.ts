// #####################
// With the knowledge that you'te gathered
// try to make a new query with the following name and type -> filterRecipes(ingredientName: String!): [Recipe!]
// this query will get the name of an ingredient and its resolver will return all recipes containing the given ingredient
// #####################
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import config from '@app/config';
import { ingredients, recipes, authors } from '@app/data';

// Create new express application
const app = express();

// Define graphQl schema
const schema = gql`
  type Query {
    authors: [Author!]!
    author(id: ID!): Author
    ingredients: [Ingredient!]!
    ingredient(id: ID!): Ingredient
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
  }

  type Mutation {
    createAuthor(name: String!, surname: String!): Author
    createIngredient(name: String!): Ingredient
    deleteIngredient(id: ID!): Ingredient
  }

  type Recipe {
    id: ID!
    author: Author!
    title: String!
    text: String!
    ingredients: [Ingredient!]!
  }

  type Ingredient {
    id: ID!
    name: String!
  }

  type Author {
    id: ID!
    name: String!
    surname: String!
  }
`;

// Resolvers will help us solve the queries
const resolvers = {
  Query: {
    authors: () => {
      return authors;
    },
    // put the names of the query parameters on the second parameter (with curly brackets)
    author: (_: any, { id }: any) => {
      // perform a check on the id of each ingredient in the array, if the check is true then return the ingredient data
      return authors.find((author) => author.id === Number.parseInt(id, 10));
    },
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
  Mutation: {
    // put the names of the query parameters on the second parameter (with curly brackets)
    createAuthor: (_: any, { name, surname }: any) => {
      // create new author object
      const newAuthor = { id: authors[authors.length - 1].id + 1, name, surname };
      // push it to the existing authors array
      authors.push(newAuthor);
      // return the newAuthor data
      return newAuthor;
    },
    createIngredient: (_: any, { name }: any) => {
      const newIngredient = { id: ingredients[ingredients.length - 1].id + 1, name };
      ingredients.push(newIngredient);
      return newIngredient;
    },
    deleteIngredient: (_: any, { id }: any) => {
      // find the index in the array of the given ingredient id
      const index = ingredients.findIndex(
        (ingredient) => ingredient.id === Number.parseInt(id, 10),
      );
      // if no ingredient is found (so index is -1) then don't delete anything and return unidefined
      if (index === -1) return undefined;

      const ingredient = ingredients[index];
      // otherwise remove the ingredient with splice
      ingredients.splice(index, 1);

      // remove the recipes that contained the ingredient
      const newRecipesData = recipes.filter(
        (rec) => !rec.ingredientIds.find((ingr) => ingr === Number.parseInt(id, 10)),
      );

      // replace data in array
      recipes.splice(0, recipes.length);
      recipes.push(...newRecipesData);

      // finally, return the data of the eliminated ingredient
      return ingredient;
    },
  },
  Recipe: {
    author: (parent: any) => {
      return authors.find((author) => author.id === Number.parseInt(parent.authorId, 10));
    },
    // the parent argument is the instance of the recipe
    ingredients: (parent: any) => {
      // scan the array of ingredients and return only the ones that are included in the parent's ingredients array
      return ingredients.filter((ingredient) => parent.ingredientIds.includes(ingredient.id));
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
