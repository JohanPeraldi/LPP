import { ingredientKeywords, applianceKeywords, utensilKeywords } from './index.js';
import { updateDataList } from './display.js';

const filterRecipes = (filter, recipes) => {
  // An array to store the ids of all filtered recipes
  const filteredRecipesIds = [];
  // If there is no filter, display all recipes
  if (!filter) {
    return recipes;
  }
  /* We look for a match between the user input and a word (or part of
   * a word) in the recipe names, lists of ingredients or descriptions
   * */
  // Filter on recipe names
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].name.length; j++) {
      for (let k = 0; k < filter.length; k++) {
        if (filter[k] !== recipes[i].name.toLowerCase()[j + k]) break;
        if (k === filter.length - 1) {
          // console.log(`Recipe name: ${recipes[i].name} - recipe id: ${recipes[i].id}`);
          /* We get the index of the current recipe and push its id
           * to the filteredRecipesIds array if it is not already in the array
           * */
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
            // console.log(`Recipe ingredient: ${recipes[i].ingredients[j].ingredient} - recipe id: ${recipes[i].id}`);
            /* We get the index of the current recipe and push its id
             * to the filteredRecipesIds array if it is not already in the array
             * */
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
          // console.log(`Recipe description: ${recipes[i].description} - recipe id: ${recipes[i].id}`);
          /* We get the index of the current recipe and push its id
           * to the filteredRecipesIds array if it is not already in the array
           * */
          const recipeId = recipes[i].id;
          if (filteredRecipesIds.indexOf(recipeId) === -1) {
            filteredRecipesIds.push(recipeId);
          }
        }
      }
    }
  }
  /* We check that filteredRecipesIds has at least one element. If it does,
   * we return an array containing the filtered recipes.
   * */
  if (filteredRecipesIds.length > 0) {
    filteredRecipesIds.sort((a, b) => a - b);
    console.log(filteredRecipesIds);
    return recipes.filter(recipe => filteredRecipesIds.includes(recipe.id));
  }
};

const filterKeywords = (filter, category) => {
  const filteredKeywords = [];
  let initialKeywords;
  let keywords;

  // Determine which options category to process
  switch (category) {
    case 'ingredients':
      initialKeywords = ingredientKeywords;
      // debugger;
      break;
    case 'appliances':
      initialKeywords = applianceKeywords;
      // debugger;
      break;
    case 'utensils':
      initialKeywords = utensilKeywords;
      // debugger;
  }
  /* We look for a match between the user input (filter) and the
   * characters in the ingredients/appliances/utensils keywords
   * (lists of advanced search options)
   * */
  console.log(`User input: ${filter}`);
  console.group('BEFORE advanced filtering');
  console.log(initialKeywords);
  console.groupEnd();
  // If filter is an empty string, return all tags
  if (filter.length === 0) {
    keywords = initialKeywords;
    // debugger;
    console.group('AFTER advanced filtering (EMPTY input)');
    console.log(keywords);
    console.groupEnd();
  } else {
    // If filter has at least one character
    for (let i = 0; i < initialKeywords.length; i++) {
      if (initialKeywords[i].toLowerCase().includes(filter.toLowerCase())) {
        filteredKeywords.push(initialKeywords[i]);
      }
    }
    keywords = filteredKeywords.sort();
    // debugger;
    console.group('AFTER advanced filtering');
    console.log(keywords);
    console.groupEnd();
  }
  /*
  else if (category === 'appliances') {
    const appliances = getTags('appliances');
    const filteredAppliances = [];
    for (let i = 0; i < appliances.length; i++) {
      if (appliances[i].toLowerCase().includes(filter.toLowerCase())) {
        filteredAppliances.push(appliances[i]);
      }
    }
    filteredAppliances.sort();
    console.log(filteredAppliances);
    updateDataList(category, filteredAppliances);
  } else {
    const utensils = getTags('utensils');
    const filteredUtensils = [];
    for (let i = 0; i < utensils.length; i++) {
      if (utensils[i].toLowerCase().includes(filter.toLowerCase())) {
        filteredUtensils.push(utensils[i]);
      }
    }
    filteredUtensils.sort();
    console.log(filteredUtensils);
    updateDataList(category, filteredUtensils);
  }
  */
  // debugger;
  updateDataList(category, keywords);
};

export { filterRecipes, filterKeywords };
