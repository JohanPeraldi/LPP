import { recipes } from './recipes.js';
import { filterRecipes } from './filter.js';
import { displayRecipes } from './display.js';

/* A global variable to store filtered recipes
(by default, will be the non filtered original recipes array) */
let filteredRecipes = recipes;

// DOM elements
const mainInputElement = document.getElementById('searchbar');
const ingredientsInputElement = document.getElementById('ingredients');
const appliancesInputElement = document.getElementById('appliances');
const utensilsInputElement = document.getElementById('utensils');
const tagElements = document.getElementsByClassName('tag');
const removeTagIconElements = document.getElementsByClassName('tag__remove-icon');

// An array containing all 3 advanced search input elements
const advancedSearchInputElements = [
  ingredientsInputElement,
  appliancesInputElement,
  utensilsInputElement
];

// A variable to indicate whether user input has more than 2 characters
let hasOverTwoChars = false;
// Display main searchbar user input to the console if it has at least 3 characters
mainInputElement.addEventListener('input', (event) => {
  const userInput = event.target.value.toLowerCase();
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
});

// Open tags list
advancedSearchInputElements.forEach(element => element.addEventListener('click', (event) => {
  const el = event.target;
  let categoryName;
  switch (el.id) {
    case 'ingredients':
      categoryName = 'ingrédient';
      break;
    case 'appliances':
      categoryName = 'appareil';
      break;
    case 'utensils':
      categoryName = 'ustensile';
  }
  el.parentElement.style.width = '50%';
  el.style.width = '100%';
  el.placeholder = `Rechercher un ${categoryName}`;
  el.parentElement.lastElementChild.style.right = '3%';
}));

// Close tags list
advancedSearchInputElements.forEach(element => element.addEventListener('blur', (event) => {
  const el = event.target;
  let categoryName;
  switch (el.id) {
    case 'ingredients':
      categoryName = 'Ingrédients';
      break;
    case 'appliances':
      categoryName = 'Appareils';
      break;
    case 'utensils':
      categoryName = 'Ustensiles';
  }
  el.parentElement.style.width = '17rem';
  el.style.width = '17rem';
  el.placeholder = `${categoryName}`;
  el.parentElement.lastElementChild.style.right = '10%';
}));

// Hide tags
// Click event on <li> element
for (let i = 0; i < tagElements.length; i++) {
  tagElements[i].addEventListener('click', (event) => {
    const el = event.target;
    const elParent = event.target.parentElement;
    el.remove();
    /* If <ul> element has no <li> child element (no tags are selected)
    remove extra margin-bottom */
    if (elParent.children.length === 0) {
      elParent.style.marginBottom = '0';
    }
  });
}
// Click event on <i> element
for (let i = 0; i < removeTagIconElements.length; i++) {
  removeTagIconElements[i].addEventListener('click', (event) => {
    const el = event.target;
    const elGrandParent = event.target.parentElement.parentElement;
    el.parentElement.remove();
    /* If <ul> element has no <li> child element (no tags are selected)
    remove extra margin-bottom */
    if (elGrandParent.children.length === 0) {
      elGrandParent.style.marginBottom = '0';
    }
  });
}

const init = () => {
  displayRecipes(recipes);
};

init();
