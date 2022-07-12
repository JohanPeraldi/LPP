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
    // Log to the console an array containing the ids of the recipes to display on the page
    console.log(recipes);
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
  console.log('No recipes match your search!');
}

export { displayRecipes };
