import { recipes } from './recipes.js';

const filterRecipes = (filter, recipes) => {
  // An array to store the ids of all filtered recipes
  const filteredRecipesIds = [];
  /* We look for a match between the user input and a word (or part of
  a word) in the recipe names, lists of ingredients or descriptions */
  // Filter on recipe names
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].name.length; j++) {
      for (let k = 0; k < filter.length; k++) {
        if (filter[k] !== recipes[i].name.toLowerCase()[j + k]) break;
        if (k === filter.length - 1) {
          console.log(`Recipe name: ${recipes[i].name} - recipe id: ${recipes[i].id}`);
          // We get the index of the current recipe and push its id
          // to the filteredRecipesIds array if it is not already in the array
          const recipeId = recipes[i].id;
          if (filteredRecipesIds.indexOf(recipeId) === -1) {
            filteredRecipesIds.push(recipeId);
          }
        }
      }
    }
  }
  // Filter on recipe ingredients
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
      for (let k = 0; k < recipes[i].ingredients[j].ingredient.length; k++) {
        for (let l = 0; l < filter.length; l++) {
          if (filter[l] !== recipes[i].ingredients[j].ingredient.toLowerCase()[k + l]) break;
          if (l === filter.length - 1) {
            console.log(`Recipe ingredient: ${recipes[i].ingredients[j].ingredient} - recipe id: ${recipes[i].id}`);
            // We get the index of the current recipe and push its id
            // to the filteredRecipesIds array if it is not already in the array
            const recipeId = recipes[i].id;
            if (filteredRecipesIds.indexOf(recipeId) === -1) {
              filteredRecipesIds.push(recipeId);
            }
          }
        }
      }
    }
  }
  // Filter on recipe descriptions
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].description.length; j++) {
      for (let k = 0; k < filter.length; k++) {
        if (filter[k] !== recipes[i].description.toLowerCase()[j + k]) break;
        if (k === filter.length - 1) {
          console.log(`Recipe description: ${recipes[i].description} - recipe id: ${recipes[i].id}`);
          // We get the index of the current recipe and push its id
          // to the filteredRecipesIds array if it is not already in the array
          const recipeId = recipes[i].id;
          if (filteredRecipesIds.indexOf(recipeId) === -1) {
            filteredRecipesIds.push(recipeId);
          }
        }
      }
    }
  }
  /* We check that filteredRecipesIds has at least one element. If it does,
  we return an array containing the filtered recipes. */
  if (filteredRecipesIds.length > 0) {
    filteredRecipesIds.sort((a, b) => a - b);
    return recipes.filter(recipe => filteredRecipesIds.includes(recipe.id));
  }
};

// Advanced search input fields
const createTagsList = () => {
  // Arrays containing all category tags (ingredients, appliances & utensils)
  const ingredientTags = [];
  const applianceTags = [];
  const utensilTags = [];
  // Loop over recipes array to create lists of category tags
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (ingredientTags.indexOf(ingredient.ingredient) === -1) {
        ingredientTags.push(ingredient.ingredient);
      }
    });
  });
  recipes.forEach((recipe) => {
    if (applianceTags.indexOf(recipe.appliance) === -1) {
      applianceTags.push(recipe.appliance);
    }
  });
  recipes.forEach((recipe) => {
    recipe.utensils.forEach((utensil) => {
      if (utensilTags.indexOf(utensil) === -1) {
        utensilTags.push(utensil);
      }
    });
  });
  // Sort all tags by ascending order
  ingredientTags.sort();
  applianceTags.sort();
  utensilTags.sort();

  return { ingredientTags, applianceTags, utensilTags };
};

console.log(createTagsList());

export { filterRecipes };
