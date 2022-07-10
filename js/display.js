const displayRecipes = (recipes) => {
  recipes.forEach(recipe => {
    console.group('Recipes');
    console.log(recipe.name);
    console.log(recipe.ingredients);
    console.log(recipe.time);
    console.log(recipe.description);
    console.groupEnd();
  });
}

const displayTags = (recipes) => {
  console.log(recipes);
}

export { displayRecipes, displayTags };
