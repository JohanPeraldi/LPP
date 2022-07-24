import { recipes } from './recipes.js';
import { displayRecipes } from './display.js';
import { handleMainSearchInputEvents, handleAdvancedSearchInputsEvents, handleTagEvents } from './events.js';
// import { getTags } from './filter.js';

/*
 * DOM ELEMENTS
 * */
const mainInputElement = document.getElementById('searchbar');
const searchTagsElement = document.querySelector('.search__tags');
const advancedSearchInputsElement = document.querySelector('.search__inputs');

/*
 * GLOBAL VARIABLES
 * */
// Filtered recipes (default to all recipes)
let filteredRecipes = recipes;
// Filtered tags by category (default to all tags)
// let filteredIngredientTags = getTags('ingredients');
// let filteredApplianceTags = getTags('appliances');
// let filteredUtensilTags = getTags('utensils');
// console.log(filteredIngredientTags, filteredApplianceTags, filteredUtensilTags);

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

export { filteredRecipes };
