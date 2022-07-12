import { recipes } from './recipes.js'
import { filterRecipes } from './filter.js'
import { displayRecipes } from './display.js'

// DOM elements
const mainInputElement = document.getElementById('searchbar')
const ingredientsInputElement = document.getElementById('ingredients')
const appliancesInputElement = document.getElementById('appliances')
const utensilsInputElement = document.getElementById('utensils')
const advancedSearchInputElements = [
  ingredientsInputElement,
  appliancesInputElement,
  utensilsInputElement
]

// Display main searchbar user input to the console if it has at least 3 characters
mainInputElement.addEventListener('input', (event) => {
  const userInput = event.target.value.toLowerCase()
  if (userInput.length > 2) {
    const filteredRecipes = filterRecipes(userInput, recipes)
    displayRecipes(filteredRecipes)
  }
})

// Open tags list
advancedSearchInputElements.forEach(element => element.addEventListener('click', (event) => {
  const el = event.target
  let categoryName;
  switch (el.id) {
    case 'ingredients':
      categoryName = 'ingrédient'
      break
    case 'appliances':
      categoryName = 'appareil'
      break
    case 'utensils':
      categoryName = 'ustensile'
  }
  el.parentElement.style.width = '50%'
  el.style.width = '100%'
  el.placeholder = `Rechercher un ${categoryName}`
  el.parentElement.lastElementChild.style.right = '3%'
}))

// Close tags list
advancedSearchInputElements.forEach(element => element.addEventListener('blur', (event) => {
  const el = event.target
  let categoryName;
  switch (el.id) {
    case 'ingredients':
      categoryName = 'Ingrédients'
      break
    case 'appliances':
      categoryName = 'Appareils'
      break
    case 'utensils':
      categoryName = 'Ustensiles'
  }
  el.parentElement.style.width = '17rem'
  el.style.width = '17rem'
  el.placeholder = `${categoryName}`
  el.parentElement.lastElementChild.style.right = '10%'
}))

const init = () => {
  displayRecipes(recipes)
}

init()
