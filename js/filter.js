/** @module filter */

import { filteredRecipes, filteredRecipesIds, ingredientKeywords, applianceKeywords, utensilKeywords } from './index.js';
import { updateDataList } from './display.js';

/**
 * A function that takes the user input as first argument (filter) and
 * the list of recipes as second argument and returns the list of
 * recipes that match the user input.
 * @function filterRecipes
 * @param {string} filter - The user input.
 * @param {Array} recipes - The list of recipes.
 * @returns {Array} - The list of recipes that match the user input.
 */
const filterRecipes = (filter, recipes) => {
  // Empty array to store the ids of filtered recipes
  filteredRecipesIds.length = 0;
  // If there is no filter (no user input), display all recipes
  if (!filter) {
    return recipes;
  }
  /* We look for a match between the user input and a word (or part of
   * a word) in the recipe names, lists of ingredients or descriptions
   */
  // Filter by recipe names
  filterRecipesByName(filter, recipes);
  // Filter by recipe ingredients
  filterRecipesByIngredient(filter, recipes);
  // Filter by recipe descriptions
  filterRecipesByDescription(filter, recipes);
  /* We check that filteredRecipesIds has at least one element. If it does,
   * we return an array containing the filtered recipes.
   */
  if (filteredRecipesIds.length > 0) {
    filteredRecipesIds.sort((a, b) => a - b);
    return recipes.filter(recipe => filteredRecipesIds.includes(recipe.id));
  }
};

/**
 * A function that filters recipes by searching for a match
 * between a substring (user input) and the recipes names.
 * @function filterRecipesByName
 * @param {string} filter - The user input.
 * @param {Array} recipes - The list of recipes.
 */
const filterRecipesByName = (filter, recipes) => {
  const matchingRecipes = recipes.filter(recipe => recipe.name.toLowerCase()
    .includes(filter.toLowerCase()));
  matchingRecipes.forEach((recipe) => {
    if (filteredRecipesIds.indexOf(recipe.id) === -1) {
      filteredRecipesIds.push(recipe.id);
    }
  });
};

/**
 * A function that filters recipes by searching for a match
 * between a substring (user input) and the recipes ingredients.
 * @function filterRecipesByIngredient
 * @param {string} filter - The user input.
 * @param {Array} recipes - The list of recipes.
 */
const filterRecipesByIngredient = (filter, recipes) => {
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((element) => {
      if (element.ingredient.toLowerCase().includes(filter.toLowerCase())) {
        if (filteredRecipesIds.indexOf(recipe.id) === -1) {
          filteredRecipesIds.push(recipe.id);
        }
      }
    });
  });
};

/**
 * A function that filters recipes by searching for a match
 * between a substring (user input) and the recipes descriptions.
 * @function filterRecipesByDescription
 * @param {string} filter - The user input.
 * @param {Array} recipes - The list of recipes.
 */
const filterRecipesByDescription = (filter, recipes) => {
  const matchingRecipes = recipes.filter(recipe => recipe.description.toLowerCase()
    .includes(filter.toLowerCase()));
  matchingRecipes.forEach((recipe) => {
    if (filteredRecipesIds.indexOf(recipe.id) === -1) {
      filteredRecipesIds.push(recipe.id);
    }
  });
};

/**
 * A function that takes a tag and the category to which it belongs
 * as arguments and returns the recipes that match the tag.
 * @function filterRecipesByDescription
 * @param {string} tag - The current tag.
 * @param {('ingredients'|'appliances'|'utensils')} category - The category the tag belongs to.
 * @returns {Array} - The list of recipes that match the current tag.
 */
const filterRecipesByTag = (tag, category) => {
  /**
   * An array that will contain the list of recipes,
   * if any, that match the current tag.
   * @constant
   * @type {Array}
   */
  const recipesFilteredByTag = [];
  // Check that filteredRecipes is not undefined
  if (filteredRecipes) {
    switch (category) {
      case 'ingredients':
        filteredRecipes.forEach((recipe) => {
          recipe.ingredients.forEach((element) => {
            if (element.ingredient.toLowerCase() === tag.toLowerCase()) {
              recipesFilteredByTag.push(recipe);
            }
          });
        });
        break;
      case 'appliances':
        filteredRecipes.forEach((recipe) => {
          if (recipe.appliance.toLowerCase() === tag.toLowerCase()) {
            recipesFilteredByTag.push(recipe);
          }
        });
        break;
      case 'utensils':
        filteredRecipes.forEach((recipe) => {
          const utensils = recipe.utensils.map(utensil => utensil.toLowerCase());
          if (utensils.includes(tag.toLowerCase())) {
            recipesFilteredByTag.push(recipe);
          }
        });
    }
  }

  return recipesFilteredByTag;
};

/**
 * A function that takes the user input and the user input category
 * as arguments and that filters keywords accordingly.
 * @function filterKeywords
 * @param {string} filter - The user input.
 * @param {string} category - The user input category.
 */
const filterKeywords = (filter, category) => {
  const filteredKeywords = [];
  let initialKeywords, keywords;
  // Determine which options category to process
  switch (category) {
    case 'ingredients':
      initialKeywords = ingredientKeywords;
      break;
    case 'appliances':
      initialKeywords = applianceKeywords;
      break;
    case 'utensils':
      initialKeywords = utensilKeywords;
  }
  /* We look for a match between the user input (filter) and the
   * characters in the ingredients/appliances/utensils keywords
   * (lists of advanced search options)
   */
  // If filter is an empty string, return all tags
  if (filter.length === 0) {
    keywords = initialKeywords;
  } else {
    // If filter has at least one character
    for (let i = 0; i < initialKeywords.length; i++) {
      if (initialKeywords[i].toLowerCase().includes(filter.toLowerCase())) {
        filteredKeywords.push(initialKeywords[i]);
      }
    }
    keywords = filteredKeywords.sort();
  }
  updateDataList(category, keywords);
};

export { filterRecipes, filterRecipesByTag, filterKeywords };
