const filterRecipes = (filter, recipes) => {
  // Find match between filter and recipe name
  const recipeNames = recipes.map(recipe => recipe.name.toLowerCase());
  // or recipe list of ingredients
  const recipeIngredients = recipes.map(recipe => recipe.ingredients); // This is an array containing 50 arrays containing ingredient objects. We are only interested in the 'ingredient' value of each of these objects.
  console.log(recipeIngredients);
  // Loop through each array and print the ingredients to the console
  for (let i = 0; i < recipeIngredients.length; i++) {
    console.group(`List of ingredients of recipe number ${i + 1}`);
    for (let j = 0; j < recipeIngredients[i].length; j++) {
      console.log(recipeIngredients[i][j].ingredient);
    }
    console.log('------------------');
    console.groupEnd();
  }
  // or recipe description
  const recipeDescriptions = recipes.map(recipe => recipe.description.toLowerCase());
  /* We look for a match between the user input and a word (or part of
  a word) in the recipe names, lists of ingredients or descriptions */
  // Filter on recipe names
  for (let i = 0; i < recipeNames.length; i++) {
    for (let j = 0; j < recipeNames[i].length; j++) {
      for (let k = 0; k < filter.length; k++) {
        if (filter[k] !== recipeNames[i][j + k]) break;
        if (k === filter.length - 1) {
          console.log(recipeNames[i]);
        }
      }
    }
  }
  // Filter on recipe ingredients
  for (let i = 0; i < recipeIngredients.length; i++) {
    for (let j = 0; j < recipeIngredients[i].length; j++) {
      for (let k = 0; k < recipeIngredients[i][j].length; j++) {
        for (let l = 0; l < filter.length; l++) {
          if (filter[l] !== recipeIngredients[i][j][k + l]) break;
          if (l === filter.length - 1) {
            console.log(recipeIngredients[i][j]);
          }
        }
      }
    }
  }
  // Filter on recipe names
  for (let i = 0; i < recipeDescriptions.length; i++) {
    for (let j = 0; j < recipeDescriptions[i].length; j++) {
      for (let k = 0; k < filter.length; k++) {
        if (filter[k] !== recipeDescriptions[i][j + k]) break;
        if (k === filter.length - 1) {
          console.log(recipeDescriptions[i]);
        }
      }
    }
  }
};

export { filterRecipes };
