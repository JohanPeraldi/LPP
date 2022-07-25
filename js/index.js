import { recipes } from './recipes.js';
import { displayRecipes } from './display.js';
import { handleMainSearchInputEvents, handleAdvancedSearchInputsEvents, handleTagEvents } from './events.js';

/*
 * DOM ELEMENTS
 * */
const mainInputElement = document.getElementById('searchbar');
const searchTagsElement = document.querySelector('.search__tags');
const advancedSearchInputsElement = document.querySelector('.search__inputs');

// A function to get keywords by category
const getKeywords = (category, recipes) => {
  // We need temporary arrays to store keywords
  const tempIngKeywords = [];
  const tempAppKeywords = [];
  const tempUteKeywords = [];
  // If there are recipes, loop over recipes array to create lists of category tags
  if (recipes) {
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (tempIngKeywords.indexOf(ingredient.ingredient) === -1) {
          tempIngKeywords.push(ingredient.ingredient);
        }
      });
    });
    recipes.forEach((recipe) => {
      if (tempAppKeywords.indexOf(recipe.appliance) === -1) {
        tempAppKeywords.push(recipe.appliance);
      }
    });
    recipes.forEach((recipe) => {
      recipe.utensils.forEach((utensil) => {
        if (tempUteKeywords.indexOf(utensil) === -1) {
          tempUteKeywords.push(utensil);
        }
      });
    });
    // Sort all tags by ascending order
    tempIngKeywords.sort();
    tempAppKeywords.sort();
    tempUteKeywords.sort();

    switch (category) {
      case 'ingredients':
        return tempIngKeywords;
      case 'appliances':
        return tempAppKeywords;
      case 'utensils':
        return tempUteKeywords;
    }

    return { tempIngKeywords, tempAppKeywords, tempUteKeywords };
  } else {
    return [];
  }
};

/*
 * GLOBAL VARIABLES
 * */
// Filtered recipes (default to all recipes)
let filteredRecipes = recipes;
// Keywords by category (default to all keywords)
let ingredientKeywords = getKeywords('ingredients', filteredRecipes);
let applianceKeywords = getKeywords('appliances', filteredRecipes);
let utensilKeywords = getKeywords('utensils', filteredRecipes);

// A function to update keywords after recipes have been filtered using main search input
const updateKeywords = (recipes) => {
  // Empty keywords arrays
  ingredientKeywords = [];
  applianceKeywords = [];
  utensilKeywords = [];
  // Fill keywords arrays using filtered recipes list
  ingredientKeywords = getKeywords('ingredients', recipes);
  applianceKeywords = getKeywords('appliances', recipes);
  utensilKeywords = getKeywords('utensils', recipes);
};

/* A function to reset filtered recipes back to initial (unfiltered)
 * recipes and update user interface with all recipes
 * */
// const resetRecipes = () => {
//   displayRecipes(filteredRecipes);
// };

// A function to update filtered recipes
// const updateRecipes = (filter) => {
//   console.log('Recipes should now be updated!');
//   filteredRecipes = filterRecipes(filter, filteredRecipes); // WRONG!!!
//   console.log(filteredRecipes);
//   displayRecipes(filteredRecipes);
// };

// Display matching recipes if user input has at least 3 characters
mainInputElement.addEventListener('input', handleMainSearchInputEvents);

// Close advanced search menus on focus on main search input
mainInputElement.addEventListener('focus', handleMainSearchInputEvents);

// Handle clicks inside advanced search section
advancedSearchInputsElement.addEventListener('click', handleAdvancedSearchInputsEvents);

/* Handle focus event on input elements (to open advanced search menu).
 * Since 'focus' and 'blur' events do not bubble up,
 * it is necessary to pass option 'true' as third argument
 * so that event is registered during capture phase.
 * */
advancedSearchInputsElement.addEventListener('focus', handleAdvancedSearchInputsEvents, true);

// Handle input event on advanced search input elements
advancedSearchInputsElement.addEventListener('input', handleAdvancedSearchInputsEvents);

// Handle click on tag close icons to remove tag
searchTagsElement.addEventListener('click', handleTagEvents);

const init = () => {
  displayRecipes(filteredRecipes);
};

init();

export { getKeywords, updateKeywords, filteredRecipes, ingredientKeywords, applianceKeywords, utensilKeywords };
