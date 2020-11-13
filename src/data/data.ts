const authors = [
  { id: 1, name: 'Bob', surname: 'Green' },
  { id: 2, name: 'John', surname: 'White' },
];

const ingredients = [
  { id: 1, name: 'Chives' },
  { id: 2, name: 'Whipped cream' },
  { id: 3, name: 'Eggs' },
  { id: 4, name: 'Milk' },
  { id: 5, name: 'Asparagus' },
  { id: 6, name: 'Ricotta' },
  { id: 7, name: 'Lemon curd' },
  { id: 8, name: 'Blue berries' },
];

const recipes = [
  {
    id: 1,
    title: 'Asparagus-Ricotta Tart',
    text:
      'Pour mixture of 15 oz. ricotta cheese, 4 lg. eggs, 1/4 c. milk, 3 Tbsp. snipped chives, 1/4 tsp. each salt and pepper into 10-in. nonstick oven-safe skillet; pencil-thin asparagus spears, trimmed to fit, and bake in 375° oven for 40 min.',
    authorId: 1,
    ingredientIds: [1, 3, 4, 5, 6],
  },
  {
    id: 2,
    title: 'Lemon-Berry Meringue Nests',
    text:
      'Fill each of 8 prepared meringue shells (from one package) with 1 tablespoon each whipped cream and lemon curd. Top with blueberries and blackberries.',
    authorId: 2,
    ingredientIds: [2, 3, 7, 8],
  },
];

export { recipes, ingredients, authors };
