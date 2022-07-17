import { createTagsList, displayRecipes } from './display.js';
import { filterRecipes } from './filter.js';
import { recipes } from './recipes.js';

/* A global variable to store filtered recipes
(by default, will be the non filtered original recipes array) */
let filteredRecipes = recipes;
// A global variable to indicate whether user input has more than 2 characters
let hasOverTwoChars = false;

const handleMainSearchInputEvents = (e) => {
  const userInput = e.target.value.toLowerCase();
  if (userInput.length > 2) {
    hasOverTwoChars = true;
    filteredRecipes = filterRecipes(userInput, recipes);
    displayRecipes(filteredRecipes);
  }
  /* If user deletes or modifies input leaving less
  than 3 characters, displayed recipes must be updated */
  if (hasOverTwoChars && userInput.length < 3) {
    hasOverTwoChars = false;
    /* When tag filtering is added, the following line will
    need to be modified to avoid removing the tag filters */
    filteredRecipes = recipes;
    displayRecipes(filteredRecipes);
  }
};

const handleAdvancedSearchInputsEvents = (e) => {
  // CLICK EVENTS
  if (e.type === 'click') {
    // We only want to listen for click events when e.target (the element clicked)
    // !== e.currentTarget (the div.search__inputs on which the event listener is placed)
    if (e.target !== e.currentTarget) {
      // We want to listen for click events on <i> elements
      // but only when their parent <form> element doesn't have the 'datalist-visible' class
      if (e.target.localName === 'i' && !e.target.parentElement.classList.contains('datalist-visible')) {
        console.log(`${e.target.previousElementSibling.id} arrow clicked`);

        // Set focus on sibling input element
        e.target.previousElementSibling.focus();
      }
    }

    e.stopPropagation();
  }

  // FOCUS EVENTS
  if (e.type === 'focus') {
    console.log(`Focus event on ${e.target.outerHTML}`);
    console.log(e);

    // When input has focus, add 'datalist-visible' class to parent <form> element
    e.target.parentElement.classList.add('datalist-visible');
    // Change input placeholder text
    const placeholder = getInputPlaceholder(e.target.id);
    e.target.placeholder = `Rechercher un ${placeholder}`;
  }
  if (e.type === 'blur') {
    console.log(`Blur event on ${e.target.outerHTML}`);
    console.log(e);

    // When input loses focus, remove 'datalist-visible' class from parent <form> element
    e.target.parentElement.classList.remove('datalist-visible');
    // Change input placeholder text back to initial value
    const placeholder = getInputPlaceholder(e.target.id);
    e.target.placeholder = placeholder.charAt(0).toUpperCase() + placeholder.slice(1) + 's';
  }
};

// A function that returns the category passed as argument
// in the required format to be used as placeholder text
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

export { handleMainSearchInputEvents, handleAdvancedSearchInputsEvents };
