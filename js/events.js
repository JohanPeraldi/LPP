/** @module events */

import { recipes } from './recipes.js';
import {
  updateRecipes,
  updateKeywords,
  replaceKeywordsList,
  filteredRecipes,
  filteredRecipesIds,
  ingredientKeywords,
  applianceKeywords,
  utensilKeywords,
  ingredientTags,
  applianceTags,
  utensilTags
} from './index.js';
import { filterRecipes, filterRecipesByTag, filterKeywords } from './filter.js';
import {
  difference,
  createDataList,
  removeDataList,
  displayRecipes,
  createTag, updateDataList
} from './display.js';

// A variable indicating whether user input has more than 2 characters
let hasOverTwoChars = false;

// EVENT HANDLER FUNCTIONS
/**
 * An event handler function that handles events from the main searchbar.
 * @function handleMainSearchInputEvents
 * @param {Object} e - The event object.
 */
const handleMainSearchInputEvents = (e) => {
  // INPUT EVENTS
  if (e.type === 'input') {
    const userInput = e.target.value.toLowerCase();
    if (userInput.length > 2) {
      if (!hasOverTwoChars) {
        hasOverTwoChars = true;
      }
      /* On every input change, compare that input
       * with any matching word in the recipes
       */
      updateRecipes(filterRecipes(userInput, recipes));
    }
    /* If user deletes or modifies input leaving less
     * than 3 characters, all recipes should be displayed
     */
    if (hasOverTwoChars && userInput.length < 3) {
      hasOverTwoChars = false;
      updateRecipes(recipes);
    }
    // Search for existing tags and filter recipes accordingly
    filterAndUpdateRecipesByTags();
    displayRecipes(filteredRecipes);
    updateKeywords(filteredRecipes);
  }

  // FOCUS EVENTS
  if (e.type === 'focus') {
    // When focus is given to main search input, any open advanced search drop-down lists should close
    closeOpenMenus(e);
  }
};

/**
 * An event handler function that handles events associated with the advanced search inputs.
 * @function handleAdvancedSearchInputEvents
 * @param {Object} e - The event object.
 */
const handleAdvancedSearchInputEvents = (e) => {
  // CLICK EVENTS
  if (e.type === 'click') {
    /* We only want to listen for click events when e.target (the element clicked)
     * !== e.currentTarget (the div.search__inputs on which the event listener is placed)
     */
    if (e.target !== e.currentTarget) {
      /* Click events on <i> elements:
       * 1) if the parent <form> element doesn't have the 'datalist-visible' class,
       * the corresponding <input> element should receive focus,
       * 2) otherwise it should lose focus, the <form> element should lose the
       * 'datalist-visible' class, the datalist should be removed and the input's
       * placeholder text be set to its initial value
       */
      if (e.target.localName === 'i') {
        handleClickOnAdvancedSearchIcon(e);
      }
      // Click events on <option> elements:
      if (e.target.localName === 'option') {
        handleClickOnOptionElement(e);
      }
    }
    e.stopPropagation();
  }

  // FOCUS EVENTS
  if (e.type === 'focus') {
    /* First check whether another datalist is open:
     * if another <form> element has the 'datalist-visible' class, remove it
     */
    closeOpenMenus(e);
    // Check whether user input has a value in order to update keywords list accordingly
    const userInput = e.target.value;
    const category = e.target.id;
    /* Check whether one or several tags have been selected
     * to make sure the datalist that will be created does not
     * contain an option which is already among the current tags
     */
    let tags, options;
    switch (category) {
      case 'ingredients':
        tags = [...new Set(ingredientTags)];
        options = [...new Set(ingredientKeywords)];
        break;
      case 'appliances':
        tags = [...new Set(applianceTags)];
        options = [...new Set(applianceKeywords)];
        break;
      case 'utensils':
        tags = [...new Set(utensilTags)];
        options = [...new Set(utensilKeywords)];
    }
    /* If there are tags, search for a match with keywords to be displayed
     * and do not allow a keyword to be in datalist if it is selected as a tag
     */
    const optionSet = new Set(options);
    const tagSet = new Set(tags);
    options = [...difference(optionSet, tagSet)];
    replaceKeywordsList(options, category);
    /* When input receives focus, check whether a datalist
     * already exists and only create one if there is none
     */
    if (!e.target.parentElement.classList.contains('datalist-visible')) {
      e.target.parentElement.classList.add('datalist-visible');
      // Change input placeholder text
      const placeholder = getInputPlaceholder(category);
      e.target.placeholder = `Rechercher un ${placeholder}`;
      // Add datalist
      createDataList(category);
      // If user input has a value, filter options accordingly
      if (userInput) {
        filterKeywords(userInput, category);
      }
    }
  }

  // INPUT EVENTS
  if (e.type === 'input') {
    // Compare input with keywords in datalist and remove those that don't match
    const userInput = e.target.value;
    const category = e.target.id;
    filterKeywords(userInput, category);
  }
};

/**
 * An event handler function that handles click events on the "open or close"
 * chevron icon associated with the advanced search input.
 * @function handleClickOnAdvancedSearchIcon
 * @param {Object} e - The event object.
 */
const handleClickOnAdvancedSearchIcon = (e) => {
  if (!e.target.parentElement.classList.contains('datalist-visible')) {
    e.target.previousElementSibling.focus();
    // If another <form> element has the 'datalist-visible' class, remove it
    closeOpenMenus(e);
  } else {
    const placeholder = getInputPlaceholder(e.target.previousElementSibling.id);
    e.target.parentElement.classList.remove('datalist-visible');
    e.target.previousElementSibling.blur();
    e.target.previousElementSibling.placeholder = placeholder.charAt(0).toUpperCase() + placeholder.slice(1) + 's';
    removeDataList(e.target.previousElementSibling.id);
  }
};

/**
 * An event handler function that handles click events on
 * the option elements inside the advanced search datalists.
 * @function handleClickOnOptionElement
 * @param {Object} e - The event object.
 */
const handleClickOnOptionElement = (e) => {
  // Check whether user input has any value in order to filter options accordingly
  const inputElement = e.target.parentElement.parentElement.firstElementChild;
  /**
   * @constant userInput
   * @type {string}
   */
  const userInput = inputElement.value;
  /**
   * @constant optionCategory
   * @type {('ingredients'|'appliances'|'utensils')} - optionCategory can only hold one of those three values.
   */
  const optionCategory = inputElement.id;
  // Create a tag with the value of the option
  createTag(e.target.value, optionCategory);
  /*
   * We want to remove the option from the datalist.
   * This means removing the datalist entirely and creating
   * a new one from which the option will have been removed.
   */
  // Remove datalist
  removeDataList(optionCategory);
  // Determine which category is currently targeted
  let currentKeywordsArray, currentTagsArray;
  switch (optionCategory) {
    case 'ingredients':
      currentKeywordsArray = ingredientKeywords;
      currentTagsArray = ingredientTags;
      break;
    case 'appliances':
      currentKeywordsArray = applianceKeywords;
      currentTagsArray = applianceTags;
      break;
    case 'utensils':
      currentKeywordsArray = utensilKeywords;
      currentTagsArray = utensilTags;
  }
  // Get option value
  const optionValue = e.target.textContent;
  // Find option index in keywords array
  const optionIndex = currentKeywordsArray.indexOf(optionValue);
  // Remove option from keywords array
  const selectedOption = currentKeywordsArray.splice(optionIndex, 1)[0];
  // Add option to tags array
  currentTagsArray.push(selectedOption);
  // Check whether a datalist already exists
  const datalist = document.querySelector('datalist');
  if (!datalist) {
    // If no datalist already exists, create new datalist with updated keywords array
    createDataList(optionCategory);
  }
  // Add 'datalist-visible' class to current form
  const currentForm = document.getElementById(`search-form-${optionCategory}`);
  currentForm.classList.add('datalist-visible');
  // Update input placeholder (should be set to its "long" version)
  const placeholder = getInputPlaceholder(optionCategory);
  currentForm.firstElementChild.placeholder = `Rechercher un ${placeholder}`;
  /* Adding a tag must also update the recipes to display
   * with the result of calling the filterRecipesByTag function
   */
  updateRecipes(filterRecipesByTag(optionValue, optionCategory));
  displayRecipes(filteredRecipes);
  // Keywords must be updated to remove those which are not related to the displayed recipes
  updateKeywords(filteredRecipes);
  // After keywords have been updated, current datalist should be updated as well
  /**
   * A variable to hold the updated value of the current options array.
   * @type {Array}
   */
  let updatedOptions;
  switch (optionCategory) {
    case 'ingredients':
      updatedOptions = ingredientKeywords;
      break;
    case 'appliances':
      updatedOptions = applianceKeywords;
      break;
    case 'utensils':
      updatedOptions = utensilKeywords;
  }
  updateDataList(optionCategory, updatedOptions);
  // If user input has a value, filter options accordingly
  if (userInput) {
    filterKeywords(userInput, optionCategory);
  }
};

/**
 * An event handler function that handles click events on "close tag" icon.
 * Closing a tag has many effects: removing the tag from the list of tags,
 * adding the tag to the list of keywords, updating displayed recipes.
 * @function handleTagEvents
 * @param {Object} e - The event object.
 */
const handleTagEvents = (e) => {
  // CLICK EVENTS
  if (e.type === 'click') {
    if (e.target !== e.currentTarget) {
      if (e.target.localName === 'i') {
        const tag = e.target.parentElement;
        // Remove tag on click on 'x' icon
        tag.parentElement.removeChild(tag);
        // Put related option back in datalist
        // Determine which category is currently targeted
        const tagCategoryClass = e.target.parentElement.classList[1];
        let tagCategory, currentKeywordsArray, currentTagsArray;
        switch (tagCategoryClass) {
          case 'tag--blue':
            tagCategory = 'ingredients';
            currentKeywordsArray = ingredientKeywords;
            currentTagsArray = ingredientTags;
            break;
          case 'tag--green':
            tagCategory = 'appliances';
            currentKeywordsArray = applianceKeywords;
            currentTagsArray = applianceTags;
            break;
          case 'tag--red':
            tagCategory = 'utensils';
            currentKeywordsArray = utensilKeywords;
            currentTagsArray = utensilTags;
        }
        /* Check for user input in order to filter keywords accordingly.
         * We need to find the input from the same category as the targeted tag.
         */
        const inputElement = document.getElementById(tagCategory);
        const userInput = inputElement.value;
        // Find tag value
        const tagValue = e.target.parentElement.textContent.trim();
        // Find tag index in tags array
        const tagIndex = currentTagsArray.indexOf(tagValue);
        // Remove tag from tags array
        const selectedTag = currentTagsArray.splice(tagIndex, 1)[0];
        // A variable to store a boolean indicating if there is a match (defaults to false)
        let match = false;
        /* If main search input is empty, match must be true otherwise removed
         * tags will not be added as options when all recipes are displayed
         */
        const mainInputElement = document.getElementById('searchbar');
        if (mainInputElement.value.length === 0) {
          match = true;
        }
        /* Loop through the filteredRecipesIds and look at the relevant keywords
         * in each of the corresponding recipes to find a match with the selected tag
         */
        filteredRecipesIds.forEach((id) => {
          filteredRecipes.forEach((recipe) => {
            if (recipe.id === id) {
              switch (tagCategory) {
                case 'ingredients':
                  recipe.ingredients.forEach((element) => {
                    if (element.ingredient.includes(selectedTag)) {
                      match = true;
                    }
                  });
                  break;
                case 'appliances':
                  if (recipe.appliance.includes(selectedTag)) {
                    match = true;
                  }
                  break;
                case 'utensils':
                  recipe.utensils.forEach((utensil) => {
                    if (utensil.includes(selectedTag)) {
                      match = true;
                    }
                  });
              }
            }
          });
        });
        if (match) {
          // Add tag to keywords array if not already there
          if (!currentKeywordsArray.includes(selectedTag)) {
            currentKeywordsArray.push(selectedTag);
          }
          // Sort array in alphabetical order
          currentKeywordsArray.sort();
          /* Check whether a datalist already exists.
           * When removing a tag, any datalist might be visible, not necessarily
           * the datalist of the same category as the tag that is removed.
           */
          const datalistElement = document.querySelector('datalist');
          if (datalistElement) {
            const formElement = datalistElement.parentElement;
            const category = formElement.firstElementChild.id;
            // Update placeholder
            const placeholder = getInputPlaceholder(category);
            formElement.firstElementChild.placeholder = placeholder.charAt(0).toUpperCase() +
              placeholder.slice(1) + 's';
            // If a datalist is visible, remove it
            formElement.removeChild(datalistElement);
            // Remove 'datalist-visible' class from parent <form> element
            formElement.classList.remove('datalist-visible');
          }
          // Create new datalist with updated keywords array
          createDataList(tagCategory);
          // If user input has a value, filter options accordingly
          if (userInput) {
            filterKeywords(userInput, tagCategory);
          }
          // Add 'datalist-visible' class to current form
          const currentForm = document.getElementById(`search-form-${tagCategory}`);
          currentForm.classList.add('datalist-visible');
          // Update placeholder
          const placeholder = getInputPlaceholder(tagCategory);
          currentForm.firstElementChild.placeholder = `Rechercher un ${placeholder}`;
        }
        /* Reset filteredRecipes to include all recipes in order
         * to filter them again by user input and by tag, if any
         */
        updateRecipes([...recipes]);
        const mainSearchInput = document.getElementById('searchbar');
        const mainUserInput = mainSearchInput.value;
        // If user input has a value, filter recipes using that input
        if (mainUserInput.length > 2) {
          updateRecipes(filterRecipes(mainUserInput, filteredRecipes));
        }
        // Then filter recipes with remaining tags, if any
        filterAndUpdateRecipesByTags();
        displayRecipes(filteredRecipes);
        // Update all keywords to match displayed recipes
        updateKeywords(filteredRecipes);
        /* Update datalist belonging to the same category
         * as the tag that has been removed
         */
        switch (tagCategory) {
          case 'ingredients':
            updateDataList('ingredients', ingredientKeywords);
            break;
          case 'appliances':
            updateDataList('appliances', applianceKeywords);
            break;
          default:
            updateDataList('utensils', utensilKeywords);
        }
      }
    }
  }
};

// OTHER FUNCTIONS
/**
 * A function that takes the current category as only argument and
 * that returns the relevant advanced search input placeholder text.
 * @function getInputPlaceholder
 * @param {string} category - One of the three categories: ingredients, appliances or utensils.
 * @returns {string} - The French singular name of the current category.
 */
const getInputPlaceholder = (category) => {
  switch (category) {
    case 'ingredients':
      return 'ingrédient';
    case 'appliances':
      return 'appareil';
    case 'utensils':
      return 'ustensile';
  }
};

/**
 * A function that closes any open advanced search menus.
 * @function closeOpenMenus
 * @param {Object} e - The event object.
 */
const closeOpenMenus = (e) => {
  if (document.querySelector('.datalist-visible')) {
    const form = document.querySelector('.datalist-visible');
    // Focus on main input field
    if (e.target.parentElement.classList.contains('search__form--default')) {
      removeDataList(form.firstElementChild.id);
    }
    // Focus on advanced input field
    if (e.target.parentElement.classList.contains('search__form--category')) {
      // Only remove datalist if an unrelated input is focused
      if (form !== e.target.parentElement) {
        removeDataList(form.firstElementChild.id);
      }
    }
  }
};

/**
 * A function that searches for tags in each category
 * filters and updates recipes to only include those
 * who match the existing tags.
 * @function filterAndUpdateRecipesByTags
 */
const filterAndUpdateRecipesByTags = () => {
  if (ingredientTags.length > 0) {
    ingredientTags.forEach(ingredient => {
      updateRecipes(filterRecipesByTag(ingredient, 'ingredients'));
    });
  }
  if (applianceTags.length > 0) {
    applianceTags.forEach(appliance => {
      updateRecipes(filterRecipesByTag(appliance, 'appliances'));
    });
  }
  if (utensilTags.length > 0) {
    utensilTags.forEach(utensil => {
      updateRecipes(filterRecipesByTag(utensil, 'utensils'));
    });
  }
};

export { handleMainSearchInputEvents, handleAdvancedSearchInputEvents, handleTagEvents, getInputPlaceholder };
