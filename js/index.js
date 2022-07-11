import { recipes } from './recipes.js'
import { filterRecipes } from './filter.js'
import { displayRecipes, displayTags } from './display.js'

// DOM elements
const mainInputElement = document.getElementById('searchbar')
const ingredientsInputElement = document.getElementById('ingredients')
const appliancesInputElement = document.getElementById('appliances')
const utensilsInputElement = document.getElementById('utensils')

// Variables to store filtered recipes & tags
const filteredRecipes = []
const tags = []

// Display main searchbar user input to the console if it has at least 3 characters
mainInputElement.addEventListener('input', (event) => {
  const userInput = event.target.value.toLowerCase()
  if (userInput.length > 2) {
    const filteredRecipes = filterRecipes(userInput, recipes)
    displayRecipes(filteredRecipes)
  }
})

// Open tags list
ingredientsInputElement.addEventListener('click', (event) => {
  const elementId = event.target.id
  console.log(`${elementId} tag list should be opened`)
})

appliancesInputElement.addEventListener('click', (event) => {
  const elementId = event.target.id
  console.log(`${elementId} tag list should be opened`)
})

utensilsInputElement.addEventListener('click', (event) => {
  const elementId = event.target.id
  console.log(`${elementId} tag list should be opened`)
})

const init = () => {
  displayRecipes(recipes)
}

init()
