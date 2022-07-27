import { ingredientKeywords, applianceKeywords, utensilKeywords, ingredientTags, applianceTags, utensilTags } from './index.js';
import { getInputPlaceholder } from './events.js';

// DOM elements
const recipeSectionElement = document.querySelector('.recipe');

const displayRecipes = (recipes) => {
  // Remove all recipes from page
  recipeSectionElement.innerHTML = '';
  // By default, display all recipes, if any
  if (recipes) {
    for (let i = 0; i < recipes.length; i++) {
      // Create recipe cards
      recipeSectionElement.appendChild(createRecipeCard(recipes[i]));
    }
  } else {
    // If no recipes match user search input, display a message to inform her
    createInfobox();
  }
};

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

// A function to create an information box in case no recipe matches user search input
const createInfobox = () => {
  const card = document.createElement('div');
  card.setAttribute('class', 'no-recipe__card');
  const informationElement = document.createElement('p');
  informationElement.setAttribute('class', 'no-recipe__infobox');
  informationElement.innerHTML = 'Aucune recette ne correspond à votre critère... vous pouvez chercher <span>« tarte aux pommes »,</span> <span>« poisson »,</span> etc.';
  card.appendChild(informationElement);
  recipeSectionElement.appendChild(card);
};

// Create category datalist
const createDataList = (category) => {
  const formElement = document.getElementById(`search-form-${category}`);
  const dataListElement = document.createElement('datalist');
  let options;
  // Tags are imported from the global variables in index.js
  switch (category) {
    case 'ingredients':
      options = ingredientKeywords;
      break;
    case 'appliances':
      options = applianceKeywords;
      break;
    case 'utensils':
      options = utensilKeywords;
  }
  dataListElement.id = `datalist-${category}`;
  dataListElement.classList.add('datalist', `datalist--${category}`);
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.innerHTML = option;
    optionElement.value = option;
    dataListElement.appendChild(optionElement);
  });
  formElement.appendChild(dataListElement);
};

// Remove datalist
const removeDataList = (category) => {
  const dataListElement = document.getElementById(`datalist-${category}`);
  const placeholder = getInputPlaceholder(dataListElement.parentElement.firstElementChild.id);
  dataListElement.parentElement.classList.remove('datalist-visible');
  dataListElement.parentElement.firstElementChild.blur();
  dataListElement.parentElement.firstElementChild.placeholder = placeholder.charAt(0).toUpperCase() +
    placeholder.slice(1) + 's';
  dataListElement.parentElement.removeChild(dataListElement);
};

// Update datalist after filtering
const updateDataList = (category, keywords) => {
  const dataList = document.getElementById(`datalist-${category}`);
  console.log(dataList);
  // Remove existing datalist
  if (dataList) {
    removeDataList(category);
  }
  // Create new list
  const formElement = document.getElementById(`search-form-${category}`);
  const dataListElement = document.createElement('datalist');
  formElement.classList.add('datalist-visible');
  formElement.firstElementChild.focus();
  dataListElement.id = `datalist-${category}`;
  dataListElement.classList.add('datalist', `datalist--${category}`);
  keywords.forEach((keyword) => {
    const optionElement = document.createElement('option');
    optionElement.innerHTML = keyword;
    optionElement.value = keyword;
    dataListElement.appendChild(optionElement);
  });
  formElement.appendChild(dataListElement);
};

// Create tag
const createTag = (option, category) => {
  /* Only create a tag if tagsListElement is empty or if
   * a tag with the same value does not already exist!
   * */
  const tagsListElement = document.querySelector('.search__tags');
  let tagAlreadyExists = true;
  console.log(`Please create the '${option}' tag, in the '${category}' category`);
  // Check whether there are any tags
  if (tagsListElement.childNodes.length === 0) {
    tagAlreadyExists = false;
    console.log('There should be no tags');
  } else {
    console.log('There is at least one tag already');
    // Check whether tag to be created already exists
    let tagsList;
    switch (category) {
      case 'ingredients':
        tagsList = ingredientTags;
        break;
      case 'appliances':
        tagsList = applianceTags;
        break;
      case 'utensils':
        tagsList = utensilTags;
    }
    tagAlreadyExists = tagsList.find(element => element === option);
  }
  if (!tagAlreadyExists) {
    console.log(`Tag already exists? Should be false: ${tagAlreadyExists}`);
    const tag = document.createElement('li');
    // Add the corresponding classes
    let tagClassModifier;
    switch (category) {
      case 'ingredients':
        tagClassModifier = 'blue';
        break;
      case 'appliances':
        tagClassModifier = 'green';
        break;
      case 'utensils':
        tagClassModifier = 'red';
    }
    tag.classList.add('tag', `tag--${tagClassModifier}`);
    tag.innerHTML = `
      ${option}
      <i class="fa-regular fa-circle-xmark fa-lg tag__remove-icon"></i>
    `;
    tagsListElement.appendChild(tag);
  }
};

export { displayRecipes, createDataList, removeDataList, updateDataList, createTag };
