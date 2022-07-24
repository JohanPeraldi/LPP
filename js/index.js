import { recipes } from './recipes.js';
import { displayRecipes } from './display.js';
import { handleMainSearchInputEvents, handleAdvancedSearchInputsEvents, handleTagEvents } from './events.js';

/*
 * DOM ELEMENTS
 * */
const mainInputElement = document.getElementById('searchbar');
const searchTagsElement = document.querySelector('.search__tags');
const advancedSearchInputsElement = document.querySelector('.search__inputs');

// A function to get tags by category
const getTags = (category, recipes) => {
  // We need temporary arrays to store tags
  const tempIngTags = [];
  const tempAppTags = [];
  const tempUteTags = [];
  // If there are recipes, loop over recipes array to create lists of category tags
  if (recipes) {
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (tempIngTags.indexOf(ingredient.ingredient) === -1) {
          tempIngTags.push(ingredient.ingredient);
        }
      });
    });
    recipes.forEach((recipe) => {
      if (tempAppTags.indexOf(recipe.appliance) === -1) {
        tempAppTags.push(recipe.appliance);
      }
    });
    recipes.forEach((recipe) => {
      recipe.utensils.forEach((utensil) => {
        if (tempUteTags.indexOf(utensil) === -1) {
          tempUteTags.push(utensil);
        }
      });
    });
    // Sort all tags by ascending order
    tempIngTags.sort();
    tempAppTags.sort();
    tempUteTags.sort();

    switch (category) {
      case 'ingredients':
        return tempIngTags;
      case 'appliances':
        return tempAppTags;
      case 'utensils':
        return tempUteTags;
    }

    return { tempIngTags, tempAppTags, tempUteTags };
  } else {
    return [];
  }
};

/*
 * GLOBAL VARIABLES
 * */
// Filtered recipes (default to all recipes)
let filteredRecipes = recipes;
// Tags by category (default to all tags)
let ingredientTags = getTags('ingredients', filteredRecipes);
let applianceTags = getTags('appliances', filteredRecipes);
let utensilTags = getTags('utensils', filteredRecipes);

// A function to update tags after recipes have been filtered using main search input
const updateTags = (recipes) => {
  // Empty tags arrays
  ingredientTags = [];
  applianceTags = [];
  utensilTags = [];
  // Fill tags arrays using filtered recipes list
  ingredientTags = getTags('ingredients', recipes);
  applianceTags = getTags('appliances', recipes);
  utensilTags = getTags('utensils', recipes);
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

// Handle input event on input elements
advancedSearchInputsElement.addEventListener('input', handleAdvancedSearchInputsEvents);

// Handle click on tag close icons to remove tag
searchTagsElement.addEventListener('click', handleTagEvents);

const init = () => {
  displayRecipes(filteredRecipes);
};

init();

export { getTags, updateTags, filteredRecipes, ingredientTags, applianceTags, utensilTags };
