import { updateKeywords, filteredRecipes, ingredientKeywords, applianceKeywords, utensilKeywords, ingredientTags, applianceTags, utensilTags } from './index.js';
import { filterRecipes, filterKeywords } from './filter.js';
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
      updateKeywords(recipesToDisplay);
    }
    /* If user deletes or modifies input leaving less
     * than 3 characters, all recipes should be displayed
     * */
    if (hasOverTwoChars && userInput.length < 3) {
      hasOverTwoChars = false;
      recipesToDisplay = filterRecipes(null, filteredRecipes);
      displayRecipes(recipesToDisplay);
      updateKeywords(recipesToDisplay);
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
        // Create a tag with the value of the option
        const optionCategory = e.target.parentElement.parentElement.firstElementChild.id;
        createTag(e.target.value, optionCategory);
        /*
         * We want to remove the option from the datalist.
         * This means removing the datalist entirely and creating
         * a new one from which the option will have been removed.
         * */
        // Remove datalist
        removeDataList(optionCategory);
        // Determine which category is currently targeted
        let currentKeywordsArray;
        let currentTagsArray;
        console.log(`Option to be removed from ${optionCategory} category`);
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
        console.log(optionValue);
        // Find option index in keywords array
        const optionIndex = currentKeywordsArray.indexOf(optionValue);
        console.log(optionIndex);
        // Remove option from keywords array
        const selectedOption = currentKeywordsArray.splice(optionIndex, 1)[0];

        console.log(currentKeywordsArray);
        console.log(currentTagsArray);
        console.log(selectedOption);

        console.log(`${selectedOption} has been removed from ${optionCategory} keywords array`);
        console.log(`${optionCategory} keywords array now contains: ${currentKeywordsArray}`);
        // Add option to tags array
        currentTagsArray.push(selectedOption);

        console.log(currentTagsArray);

        console.log(`${optionCategory} tags array now contains: ${currentTagsArray}`);
        // Check whether a datalist already exists
        const datalist = document.querySelector('datalist');
        if (!datalist) {
          // If no datalist already exists, create new datalist with updated keywords array
          createDataList(optionCategory);
        }
        // Add 'datalist-visible' class to current form
        const currentForm = document.getElementById(`search-form-${optionCategory}`);
        currentForm.classList.add('datalist-visible');
      }
    }

    e.stopPropagation();
  }

  // FOCUS EVENTS
  if (e.type === 'focus') {
    /* First check whether another datalist is open:
     * if another <form> element has the 'datalist-visible' class, remove it
     * */
    closeOpenMenus(e);

    /* When input receives focus, check whether a datalist
     * already exists and only create one if there is none
     * */
    if (!e.target.parentElement.classList.contains('datalist-visible')) {
      e.target.parentElement.classList.add('datalist-visible');
      // Change input placeholder text
      const placeholder = getInputPlaceholder(e.target.id);
      e.target.placeholder = `Rechercher un ${placeholder}`;
      // Add datalist
      createDataList(e.target.id);
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
        let tagCategory;
        let currentKeywordsArray;
        let currentTagsArray;
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
        // Find tag value
        const tagValue = e.target.parentElement.textContent.trim();
        console.log(tagValue);
        // Find tag index in tags array
        const tagIndex = currentTagsArray.indexOf(tagValue);

        console.log(currentTagsArray);
        console.log(tagIndex);

        // Remove tag from tags array
        const selectedTag = currentTagsArray.splice(tagIndex, 1)[0];
        console.log(selectedTag);
        // Add tag to keywords array
        /* PROBLEM: if tag was selected and user filters recipe with main search input,
         * this could lead to adding an option to a datalist that should not have such
         * an option, for example when selecting "Ail", typing "cum" in the main search bar
         * and then removing the "Ail" tag. In such a scenario, "Ail" will be added to
         * the list of ingredients although it isn't an ingredient for the only remaining
         * recipe!
         * */
        currentKeywordsArray.push(selectedTag);
        // Sort array in alphabetical order
        currentKeywordsArray.sort();
        console.log(currentKeywordsArray);
        console.log(ingredientKeywords);
        console.log(ingredientTags);

        /* Check whether a datalist already exists.
         * When removing a tag, any datalist might be visible, not necessarily
         * the datalist of the same category as the tag that is removed.
         * */
        const datalistElement = document.querySelector('datalist');
        if (datalistElement) {
          const formElement = datalistElement.parentElement;
          // If a datalist is visible, remove it
          formElement.removeChild(datalistElement);
          // Remove 'datalist-visible' class from parent <form> element
          formElement.classList.remove('datalist-visible');
        }
        // Create new datalist with updated keywords array
        createDataList(tagCategory);
        // Add 'datalist-visible' class to current form
        const currentForm = document.getElementById(`search-form-${tagCategory}`);
        currentForm.classList.add('datalist-visible');
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
