import { recipes } from './recipes.js';
import { displayRecipes } from './display.js';
import { handleMainSearchInputEvents, handleAdvancedSearchInputsEvents } from './events.js';

// DOM elements
const mainInputElement = document.getElementById('searchbar');
const advancedSearchInputsElement = document.querySelector('.search__inputs');

// Display matching recipes if user input has at least 3 characters
mainInputElement.addEventListener('input', handleMainSearchInputEvents);

// Handle clicks inside advanced search section
advancedSearchInputsElement.addEventListener('click', handleAdvancedSearchInputsEvents);

// Handle focus event on input elements (to open advanced search menu).
// Important reminder: since 'focus' events do not bubble up,
// it is necessary to pass option 'true' as third argument so that
// event is dealt with in capture phase.
advancedSearchInputsElement.addEventListener('focus', handleAdvancedSearchInputsEvents, true);

// Handle blur event on input elements (to close advanced search menu).
// Important reminder: since 'blur' events do not bubble up,
// it is necessary to pass option 'true' as third argument so that
// event is dealt with in capture phase.
advancedSearchInputsElement.addEventListener('blur', handleAdvancedSearchInputsEvents, true);

// Handle input event on input elements
advancedSearchInputsElement.addEventListener('input', handleAdvancedSearchInputsEvents);

const init = () => {
  displayRecipes(recipes);
};

init();
