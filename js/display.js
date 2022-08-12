/** @module display */

import {
  applianceKeywords,
  applianceTags,
  ingredientKeywords,
  ingredientTags,
  utensilKeywords,
  utensilTags
} from './index.js';
import { getInputPlaceholder } from './events.js';

// DOM elements
const recipeSectionElement = document.querySelector('.recipe');

/**
 * A function that removes all displayed recipes and that
 * calls the createRecipeCard function for each recipe in
 * the current list of recipes (defaults to all recipes).
 * If there are no recipes to display, the createInfobox
 * function is called.
 * @function displayRecipes
 * @param {Array} recipes - The list of recipes.
 */
const displayRecipes = (recipes) => {
  // Remove all recipes from page
  recipeSectionElement.innerHTML = '';
  // By default, display all recipes, if any
  if (recipes) {
    if (recipes.length > 0) {
      for (let i = 0; i < recipes.length; i++) {
        // Create recipe cards
        recipeSectionElement.appendChild(createRecipeCard(recipes[i]));
      }
    } else {
      // If no recipe matches user input, display message to that effect
      createInfobox();
    }
  } else {
    // If no recipe matches user input, display message to that effect
    createInfobox();
  }
};

/**
 * A function that takes a single recipe as only argument
 * and that returns an HTML <div> element representing
 * that recipe in the form of a recipe "card".
 * @function createRecipeCard
 * @param {Object} recipe - An object representing a recipe.
 * @returns {HTMLDivElement} - An HTML <div> element representing
 * a single recipe "card" ready to be injected in the DOM.
 */
const createRecipeCard = (recipe) => {
  const card = document.createElement('div');
  card.setAttribute('class', 'recipe__card');
  const imageElement = document.createElement('div');
  imageElement.setAttribute('class', 'recipe__image');
  const textElement = document.createElement('div');
  textElement.setAttribute('class', 'recipe__text');
  const headerElement = document.createElement('div');
  headerElement.setAttribute('class', 'recipe__header');
  const h2Element = document.createElement('h2');
  h2Element.setAttribute('class', 'recipe__title');
  h2Element.textContent = recipe.name;
  const spanElement = document.createElement('span');
  spanElement.setAttribute('class', 'recipe__time');
  const iElement = document.createElement('i');
  iElement.setAttribute('class', 'fa-regular fa-clock');
  const strongElement = document.createElement('strong');
  strongElement.textContent = `${recipe.time} min`;
  spanElement.appendChild(iElement);
  spanElement.appendChild(strongElement);
  headerElement.appendChild(h2Element);
  headerElement.appendChild(spanElement);
  const detailsElement = document.createElement('div');
  detailsElement.setAttribute('class', 'recipe__details');
  const ingredientsElement = document.createElement('div');
  ingredientsElement.setAttribute('class', 'recipe__ingredients');
  const ingredientsListElement = document.createElement('ul');
  recipe.ingredients.forEach((ingredient) => {
    const listItemElement = document.createElement('li');
    const strongElement = document.createElement('strong');
    strongElement.textContent = ingredient.ingredient;
    listItemElement.appendChild(strongElement);
    // Add quantity if specified
    if (ingredient.quantity) {
      const spanElement = document.createElement('span');
      spanElement.textContent = `: ${ingredient.quantity}`;
      // Add unit if specified
      if (ingredient.unit) {
        // If unit is 'grammes' shorten it to 'g'
        if (ingredient.unit.toLowerCase() === 'grammes') {
          ingredient.unit = 'g';
        }
        // If unit is 'cuillère(s) à soupe' shorten it to 'c. à s.'
        if (ingredient.unit.toLowerCase() === 'cuillère à soupe' ||
          ingredient.unit.toLowerCase() === 'cuillères à soupe') {
          ingredient.unit = 'c. à s.';
        }
        // If unit is 'cuillère(s) à café' shorten it to 'c. à c.'
        if (ingredient.unit.toLowerCase() === 'cuillère à café' ||
          ingredient.unit.toLowerCase() === 'cuillères à café') {
          ingredient.unit = 'c. à c.';
        }
        // If unit is 'litre(s)' shorten it to 'l'
        if (ingredient.unit.toLowerCase() === 'litre' ||
          ingredient.unit.toLowerCase() === 'litres') {
          ingredient.unit = 'l';
        }
        spanElement.textContent += ` ${ingredient.unit}`;
      }
      listItemElement.appendChild(spanElement);
    }
    ingredientsListElement.appendChild(listItemElement);
  });
  ingredientsElement.appendChild(ingredientsListElement);
  const instructionsElement = document.createElement('p');
  instructionsElement.setAttribute('class', 'recipe__instructions');
  instructionsElement.textContent = recipe.description;
  detailsElement.appendChild(ingredientsElement);
  detailsElement.appendChild(instructionsElement);
  textElement.appendChild(headerElement);
  textElement.appendChild(detailsElement);
  card.appendChild(imageElement);
  card.appendChild(textElement);

  return card;
};

/**
 * A function to create a message to inform the user that no recipe matches her input.
 * @function createInfobox
 */
const createInfobox = () => {
  const card = document.createElement('div');
  card.setAttribute('class', 'no-recipe__card');
  const informationElement = document.createElement('p');
  informationElement.setAttribute('class', 'no-recipe__infobox');
  informationElement.innerHTML = 'Aucune recette ne correspond à votre critère... vous pouvez chercher <span>« tarte aux pommes »,</span> <span>« poisson »,</span> etc.';
  card.appendChild(informationElement);
  recipeSectionElement.appendChild(card);
};

/**
 * A function that returns a set representing a list from which
 * elements also present in another list have been removed (used
 * in createDataList below to remove from the options list the
 * items that are already displayed as tags (in existingTags).
 * It is to be noted that the function takes two arguments which
 * are meant to be sets, but it seems that passing arrays instead
 * will also work.
 * @function difference
 * @param {Set} setA - The set from which elements will be removed.
 * @param {Set} setB - The set that will be looped through in search for
 * elements that are present in the other set.
 * @returns {Set} - The set that was given as first argument, from
 * which elements present in the second set will have been removed.
 */
const difference = (setA, setB) => {
  const diff = new Set(setA);
  for (const elem of setB) {
    diff.delete(elem);
  }
  return diff;
};

/**
 * A function that takes the datalist category as only argument
 * and that creates a datalist containing all the options
 * available in that category.
 * @function createDataList
 * @param {string} category
 */
const createDataList = (category) => {
  /* Because we don't want an option to appear in the datalist if it is
   * already selected as a tag, there needs to be a comparison between any
   * existing tags and the keywords to display in the datalist to be created.
   * This is done by creating sets from the options and tags arrays and
   * removing items from the options array when they are present in the tags
   * array, using the "difference" function above.
   */
  const formElement = document.getElementById(`search-form-${category}`);
  const dataListElement = document.createElement('datalist');
  /* Variables to store the keywords and existing tags in the current category
   * as well as the category placeholder text
   */
  let keywords, tags, categoryPlaceholder;
  // Keywords and tags are imported from the global variables in index.js
  switch (category) {
    case 'ingredients':
      keywords = ingredientKeywords;
      tags = ingredientTags;
      categoryPlaceholder = 'ingrédient';
      break;
    case 'appliances':
      keywords = applianceKeywords;
      tags = applianceTags;
      categoryPlaceholder = 'appareil';
      break;
    case 'utensils':
      keywords = utensilKeywords;
      tags = utensilTags;
      categoryPlaceholder = 'ustensile';
  }
  keywords = [...new Set(keywords)];
  tags = [...new Set(tags)];
  keywords = [...difference(keywords, tags)];
  dataListElement.id = `datalist-${category}`;
  dataListElement.classList.add('datalist', `datalist--${category}`);
  addDataListContent(keywords, formElement, dataListElement, categoryPlaceholder);
};

/**
 * A function that takes the datalist category as only argument
 * and that removes the datalist element from the DOM.
 * @function removeDataList
 * @param {string} category - The category the datalist belongs to.
 */
const removeDataList = (category) => {
  const dataListElement = document.getElementById(`datalist-${category}`);
  const placeholder = getInputPlaceholder(dataListElement.parentElement.firstElementChild.id);
  dataListElement.parentElement.classList.remove('datalist-visible');
  dataListElement.parentElement.firstElementChild.blur();
  dataListElement.parentElement.firstElementChild.placeholder = placeholder.charAt(0).toUpperCase() +
    placeholder.slice(1) + 's';
  dataListElement.parentElement.removeChild(dataListElement);
};

/**
 * A function that updates the datalist form the specified category (first argument)
 * and that creates a new datalist with the keywords passed to the function (second argument).
 * @function updateDataList
 * @param {string} category - The category the datalist belongs to.
 * @param {Array} keywords - The list of keywords to be displayed as datalist options.
 */
const updateDataList = (category, keywords) => {
  const dataList = document.getElementById(`datalist-${category}`);
  // Remove existing datalist
  if (dataList) {
    removeDataList(category);
  }
  // Create new list
  const formElement = document.getElementById(`search-form-${category}`);
  const dataListElement = document.createElement('datalist');
  formElement.classList.add('datalist-visible');
  formElement.firstElementChild.focus();
  // Update placeholder
  const placeholder = getInputPlaceholder(category);
  formElement.firstElementChild.placeholder = `Rechercher un ${placeholder}`;
  dataListElement.id = `datalist-${category}`;
  dataListElement.classList.add('datalist', `datalist--${category}`);
  // Remove options that are selected as tags
  keywords = [...new Set(keywords)];
  let tags, categoryPlaceholder;
  switch (category) {
    case 'ingredients':
      tags = ingredientTags;
      categoryPlaceholder = 'ingrédient';
      break;
    case 'appliances':
      tags = applianceTags;
      categoryPlaceholder = 'appareil';
      break;
    case 'utensils':
      tags = utensilTags;
      categoryPlaceholder = 'ustensile';
  }
  tags = [...new Set(tags)];
  keywords = [...difference(new Set(keywords), tags)];
  addDataListContent(keywords, formElement, dataListElement, categoryPlaceholder);
};

/**
 * A function that adds the datalist option elements if there are any,
 * or adds a message indicating that no options have been found if there
 * are no options available.
 * @function addDataListContent
 * @param {Array} keywords - The list of options to be inserted in the datalist.
 * @param {Object} formElement - The datalist parent element.
 * @param {Object} dataListElement - The datalist element.
 * @param {('ingrédient'|'appareil'|'ustensile')} categoryPlaceholder - The placeholder text
 * for the datalist category.
 */
const addDataListContent = (keywords, formElement, dataListElement, categoryPlaceholder) => {
  if (keywords.length === 0) {
    displayNoKeywordMessage(dataListElement, categoryPlaceholder);
  } else {
    keywords.forEach((keyword) => {
      const optionElement = document.createElement('option');
      optionElement.innerHTML = keyword;
      optionElement.value = keyword;
      dataListElement.appendChild(optionElement);
    });
  }
  formElement.appendChild(dataListElement);
};

/**
 * A function that displays a message beneath advanced search inputs
 * indicating that no keyword was found.
 * @function displayNoKeywordMessage
 * @param {Object} parentElement - The DOM element to which the message element will be appended.
 * @param {('ingrédient'|'appareil'|'ustensile')} categoryPlaceholder - The category in which no keywords were found.
 */
const displayNoKeywordMessage = (parentElement, categoryPlaceholder) => {
  const noKeywordMessageElement = document.createElement('option');
  noKeywordMessageElement.textContent = `Aucun ${categoryPlaceholder} trouvé`;
  noKeywordMessageElement.classList.add('non-clickable');
  parentElement.appendChild(noKeywordMessageElement);
};

/**
 * A function that takes an option as first argument and the category
 * it belongs to as second argument and that creates a tag corresponding
 * to that option if the tag does not already exist.
 * @function createTag
 * @param {string} option - The option to be created as tag.
 * @param {string} category - The category the option belongs to.
 */
const createTag = (option, category) => {
  /* Only create a tag if tagsListElement is empty or if
   * a tag with the same value does not already exist!
   */
  const tagsListElement = document.querySelector('.search__tags');
  /**
   * @type {boolean}
   */
  let tagAlreadyExists = true;
  // Select current category tags list and the relevant CSS modifier class
  /**
   * @type {Array}
   */
  let tagsList;
  /**
   * @type {('blue'|'green'|'red')} - tagClassModifier can only hold one of those three values.
   */
  let tagClassModifier;
  switch (category) {
    case 'ingredients':
      tagsList = ingredientTags;
      tagClassModifier = 'blue';
      break;
    case 'appliances':
      tagsList = applianceTags;
      tagClassModifier = 'green';
      break;
    case 'utensils':
      tagsList = utensilTags;
      tagClassModifier = 'red';
  }
  // Check whether there are any tags
  if (tagsListElement.childNodes.length === 0) {
    tagAlreadyExists = false;
  } else {
    // Check whether tag to be created already exists
    const found = tagsList.find(element => element === option);
    if (!found) {
      tagAlreadyExists = false;
    }
  }
  if (!tagAlreadyExists) {
    const tag = document.createElement('li');
    // Add the corresponding classes
    tag.classList.add('tag', `tag--${tagClassModifier}`);
    tag.innerHTML = `
      ${option}
      <i class="fa-regular fa-circle-xmark fa-lg tag__remove-icon"></i>
    `;
    tagsListElement.appendChild(tag);
  }
};

export { displayRecipes, difference, createDataList, removeDataList, updateDataList, createTag };
