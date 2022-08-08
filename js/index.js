/** @module index */

import { recipes } from './recipes.js';
import { displayRecipes } from './display.js';
import { handleMainSearchInputEvents, handleAdvancedSearchInputsEvents, handleTagEvents } from './events.js';

// DOM ELEMENTS
const mainInputElement = document.getElementById('searchbar');
const searchTagsElement = document.querySelector('.search__tags');
const advancedSearchInputsElement = document.querySelector('.search__inputs');

// FUNCTIONS
/** @function getKeywords
 * A function that returns the keywords found in the specified category.
 * @param {string} category - The category the keyword belongs to (either 'ingredients', 'appliances' or 'utensils').
 * @param {Array} recipes - An array containing the recipes (if any) from which the keywords will be taken.
 * @returns {Array} - An array containing the keywords found in the specified category.
 * */
const getKeywords = (category, recipes) => {
  /**
   * An array to store keywords from the specified category.
   * @type {Array}
   * */
  let keywords = [];
  // If there are recipes, loop over recipes array to create list of keywords in the specified category
  if (recipes) {
    switch (category) {
      case 'ingredients':
        keywords = getIngredientKeywords(recipes);
        break;
      case 'appliances':
        keywords = getApplianceKeywords(recipes);
        break;
      case 'utensils':
        keywords = getUtensilKeywords(recipes);
    }
  }
  // If there are no recipes, an empty array will be returned

  return keywords;
};

/** @function getIngredientKeywords
 * A function that returns the keywords found in the "ingredients" category.
 * @param {Array} recipes - An array containing the recipes (if any) from which the keywords will be taken.
 * @returns {Array} - An array containing the keywords found in the "ingredients" category.
 * */
const getIngredientKeywords = (recipes) => {
  /**
   * An array to store keywords from the "ingredients" category.
   * @constant
   * @type {Array}
   * */
  const keywords = [];
  if (recipes) {
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((element) => {
        if (keywords.indexOf(element.ingredient) === -1) {
          keywords.push(element.ingredient);
        }
      });
    });
    // Sort keywords alphabetically
    keywords.sort();
  }

  return keywords;
};

/** @function getApplianceKeywords
 * A function that returns the keywords found in the "appliances" category.
 * @param {Array} recipes - An array containing the recipes (if any) from which the keywords will be taken.
 * @returns {Array} - An array containing the keywords found in the "appliances" category.
 * */
const getApplianceKeywords = (recipes) => {
  /**
   * An array to store keywords from the "appliances" category.
   * @constant
   * @type {Array}
   * */
  const keywords = [];
  if (recipes) {
    recipes.forEach((recipe) => {
      if (keywords.indexOf(recipe.appliance) === -1) {
        keywords.push(recipe.appliance);
      }
    });
    // Sort keywords alphabetically
    keywords.sort();
  }

  return keywords;
};

/** @function getUtensilKeywords
 * A function that returns the keywords found in the "utensils" category.
 * @param {Array} recipes - An array containing the recipes (if any) from which the keywords will be taken.
 * @returns {Array} - An array containing the keywords found in the "utensils" category.
 * */
const getUtensilKeywords = (recipes) => {
  /**
   * An array to store keywords from the "utensils" category.
   * @constant
   * @type {Array}
   * */
  const keywords = [];
  if (recipes) {
    recipes.forEach((recipe) => {
      recipe.utensils.forEach((utensil) => {
        if (keywords.indexOf(utensil) === -1) {
          keywords.push(utensil);
        }
      });
    });
    // Sort keywords alphabetically
    keywords.sort();
  }

  return keywords;
};

/** @function updateRecipes
 * A function that updates the filteredRecipes variable after filtering
 * @param {Array} updatedRecipes - An array containing the filtered recipes
 * */
const updateRecipes = (updatedRecipes) => {
  filteredRecipes = updatedRecipes;
};

/** @function updateKeywords
 * A function that updates the keywords in each category after recipes have been filtered.
 * @param {Array} recipes - An array containing the recipes (if any) from which the keywords will be taken.
 * */
const updateKeywords = (recipes) => {
  updateIngredientKeywords(recipes);
  updateApplianceKeywords(recipes);
  updateUtensilKeywords(recipes);
};

/** @function updateIngredientKeywords
 * A function that updates the keywords in the "ingredients" category.
 * @param {Array} recipes - An array containing the recipes (if any) from which the keywords will be taken.
 * */
const updateIngredientKeywords = (recipes) => {
  // Empty ingredientKeywords array
  ingredientKeywords = [];
  // Fill ingredientKeywords array
  ingredientKeywords = getIngredientKeywords(recipes);
};

/** @function updateApplianceKeywords
 * A function that updates the keywords in the "appliances" category.
 * @param {Array} recipes - An array containing the recipes (if any) from which the keywords will be taken.
 * */
const updateApplianceKeywords = (recipes) => {
  // Empty applianceKeywords array
  applianceKeywords = [];
  // Fill applianceKeywords array
  applianceKeywords = getApplianceKeywords(recipes);
};

/** @function updateUtensilKeywords
 * A function that updates the keywords in the "utensils" category.
 * @param {Array} recipes - An array containing the recipes (if any) from which the keywords will be taken.
 * */
const updateUtensilKeywords = (recipes) => {
  // Empty utensilKeywords array
  utensilKeywords = [];
  // Fill utensilKeywords array
  utensilKeywords = getUtensilKeywords(recipes);
};

// GLOBAL VARIABLES
/**
 * An array to store the ids of all filtered recipes.
 * @constant
 * @type {Array}
 * */
const filteredRecipesIds = [];
/**
 * An array to store tags from the "ingredients" category.
 * @constant
 * @type {Array}
 * */
const ingredientTags = [];
/**
 * An array to store tags from the "appliances" category.
 * @constant
 * @type {Array}
 * */
const applianceTags = [];
/**
 * An array to store tags from the "utensils" category.
 * @constant
 * @type {Array}
 * */
const utensilTags = [];
// Filtered recipes (default to all recipes)
let filteredRecipes = [...recipes];
// Keywords by category (default to all keywords)
let ingredientKeywords = getIngredientKeywords(filteredRecipes);
let applianceKeywords = getApplianceKeywords(filteredRecipes);
let utensilKeywords = getUtensilKeywords(filteredRecipes);

// EVENT LISTENERS
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

export {
  getKeywords,
  updateRecipes,
  updateKeywords,
  filteredRecipes,
  filteredRecipesIds,
  ingredientKeywords,
  applianceKeywords,
  utensilKeywords,
  ingredientTags,
  applianceTags,
  utensilTags
};
