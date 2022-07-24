import { getTags, updateTags, filteredRecipes } from './index.js';
import { filterRecipes, filterTags } from './filter.js';
import { createDataList, removeDataList, displayRecipes, createTag } from './display.js';

// A variable indicating whether user input has more than 2 characters
let hasOverTwoChars = false;

/*
* EVENT HANDLER FUNCTIONS
* */
const handleMainSearchInputEvents = (e) => {
  // INPUT EVENTS
  if (e.type === 'input') {
    const userInput = e.target.value.toLowerCase();
    let recipesToDisplay;
    if (userInput.length > 2) {
      console.log(`User input: ${userInput}`);
      if (!hasOverTwoChars) {
        hasOverTwoChars = true;
      }
      // On every input change, compare that input with any matching word in the recipes
      recipesToDisplay = filterRecipes(userInput, filteredRecipes);
      displayRecipes(recipesToDisplay);
      updateTags(recipesToDisplay);
    }
    /* If user deletes or modifies input leaving less
     * than 3 characters, all recipes should be displayed
     * */
    if (hasOverTwoChars && userInput.length < 3) {
      hasOverTwoChars = false;
      recipesToDisplay = filterRecipes(null, filteredRecipes);
      displayRecipes(recipesToDisplay);
      updateTags(recipesToDisplay);
    }
  }

  // FOCUS EVENTS
  if (e.type === 'focus') {
    closeOpenMenus(e);
  }
};

const handleAdvancedSearchInputsEvents = (e) => {
  // CLICK EVENTS
  if (e.type === 'click') {
    /* We only want to listen for click events when e.target (the element clicked)
     * !== e.currentTarget (the div.search__inputs on which the event listener is placed)
     * */
    if (e.target !== e.currentTarget) {
      /* Click events on <i> elements:
       * 1) if the parent <form> element doesn't have the 'datalist-visible' class,
       * the corresponding <input> element should receive focus,
       * 2) otherwise it should lose focus, the <form> element should lose the
       * 'datalist-visible' class, the datalist should be removed and the input's
       * placeholder text be set to its initial value
       * */
      if (e.target.localName === 'i') {
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
      }
      // Click events on <option> elements:
      if (e.target.localName === 'option') {
        // We want to create a tag with the value of the option
        const optionCategory = e.target.parentElement.parentElement.firstElementChild.id;
        createTag(e.target.value, optionCategory);
      }
    }

    e.stopPropagation();
  }

  // FOCUS EVENTS
  if (e.type === 'focus') {
    /* First check whether another data list is open:
     * if another <form> element has the 'datalist-visible' class, remove it
     * */
    closeOpenMenus(e);

    // When input has focus, add 'datalist-visible' class to parent <form> element
    e.target.parentElement.classList.add('datalist-visible');
    // Change input placeholder text
    const placeholder = getInputPlaceholder(e.target.id);
    e.target.placeholder = `Rechercher un ${placeholder}`;
    // Add datalist
    createDataList(e.target.id);
  }

  // INPUT EVENTS
  if (e.type === 'input') {
    // Compare input with keywords in data list and remove those that don't match
    const userInput = e.target.value;
    const category = e.target.id;
    console.log(userInput, category);
    filterTags(userInput, category);
  }
};

const handleTagEvents = (e) => {
  // CLICK EVENTS
  if (e.type === 'click') {
    if (e.target !== e.currentTarget) {
      if (e.target.localName === 'i') {
        const tag = e.target.parentElement;
        tag.parentElement.removeChild(tag);
      }
    }
  }
};

/* A function that returns the category passed as argument
 * in the required format to be used as placeholder text
 * */
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

// A function that closes any open advanced search menus
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

export { handleMainSearchInputEvents, handleAdvancedSearchInputsEvents, handleTagEvents, getInputPlaceholder };
