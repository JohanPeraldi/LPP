import { createDataList, removeDataList, displayRecipes, createTag } from './display.js';
import { filterRecipes, filterTags } from './filter.js';
import { recipes } from './recipes.js';

/* A global variable to store filtered recipes
 * (by default, will be the non filtered original recipes array)
 * */
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
   * than 3 characters, displayed recipes must be updated
   * */
  if (hasOverTwoChars && userInput.length < 3) {
    hasOverTwoChars = false;
    /* When tag filtering is added, the following line will
     * need to be modified to avoid removing the tag filters
     * */
    filteredRecipes = recipes;
    displayRecipes(filteredRecipes);
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

// A function that closes any open menus before opening another
const closeOpenMenus = (event) => {
  if (document.querySelector('.datalist-visible')) {
    const siblingForm = document.querySelector('.datalist-visible');
    const placeholder = getInputPlaceholder(siblingForm.firstElementChild.id);
    if (siblingForm !== event.target.parentElement) {
      siblingForm.classList.remove('datalist-visible');
      siblingForm.firstElementChild.blur();
      siblingForm.firstElementChild.placeholder = placeholder.charAt(0).toUpperCase()
        + placeholder.slice(1) + 's';
      removeDataList(siblingForm.firstElementChild.id);
    }
  }
};

export { filteredRecipes, handleMainSearchInputEvents, handleAdvancedSearchInputsEvents, handleTagEvents };
