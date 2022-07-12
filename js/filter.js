const filterRecipes = (filter, recipes) => {
  // An array to store the ids of all filtered recipes
  const filteredRecipesIds = [];
  // An array with all the recipe names
  const recipeNames = recipes.map(recipe => recipe.name);
  /* An array of 50 arrays with ingredient objects.
  We are only interested in the 'ingredient' value of these objects. */
  const recipeIngredients = recipes.map(recipe => recipe.ingredients);
  // An array with all the recipe descriptions
  const recipeDescriptions = recipes.map(recipe => recipe.description);
  /* We look for a match between the user input and a word (or part of
  a word) in the recipe names, lists of ingredients or descriptions */
  // Filter on recipe names
  for (let i = 0; i < recipeNames.length; i++) {
    for (let j = 0; j < recipeNames[i].length; j++) {
      for (let k = 0; k < filter.length; k++) {
        if (filter[k] !== recipeNames[i].toLowerCase()[j + k]) break;
        if (k === filter.length - 1) {
          console.log(recipeNames[i]);
          // We get the index of the current recipe and push its id (index + 1)
          // to the filteredRecipesIds array if it is not already in the array
          const recipeId = recipes.findIndex(recipe => recipe.name === recipeNames[i]) + 1;
          // console.log(recipeId)
          if (filteredRecipesIds.indexOf(recipeId) === -1) {
            filteredRecipesIds.push(recipeId);
          }
        }
      }
    }
  }
  // Filter on recipe ingredients
  for (let i = 0; i < recipeIngredients.length; i++) {
    for (let j = 0; j < recipeIngredients[i].length; j++) {
      for (let k = 0; k < recipeIngredients[i][j].ingredient.length; k++) {
        for (let l = 0; l < filter.length; l++) {
          if (filter[l] !== recipeIngredients[i][j].ingredient.toLowerCase()[k + l]) break;
          if (l === filter.length - 1) {
            console.log(recipeIngredients[i][j].ingredient);
            // We want to push the ids of the filtered recipes to an array instead of returning them
          }
        }
      }
    }
  }
  // Filter on recipe descriptions
  for (let i = 0; i < recipeDescriptions.length; i++) {
    for (let j = 0; j < recipeDescriptions[i].length; j++) {
      for (let k = 0; k < filter.length; k++) {
        if (filter[k] !== recipeDescriptions[i].toLowerCase()[j + k]) break;
        if (k === filter.length - 1) {
          console.log(recipeDescriptions[i]);
          // We get the index of the current recipe and push its id (index + 1)
          // to the filteredRecipesIds array if it is not already in the array
          const recipeId = recipes.findIndex(recipe => recipe.description === recipeDescriptions[i]) + 1;
          // console.log(recipeId)
          if (filteredRecipesIds.indexOf(recipeId) === -1) {
            filteredRecipesIds.push(recipeId);
          }
        }
      }
    }
  }

  // Instead of return an array containing all the ids of the filtered recipes,
  // we should return an array containing the filtered recipes themselves
  filteredRecipesIds.sort((a, b) => a - b);
  return recipes.filter(recipe => filteredRecipesIds.includes(recipe.id));
};

export { filterRecipes };
