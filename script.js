
const searchbox = document.querySelector('.searchbox');
const searchbtn = document.querySelector('.searchbtn');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeContainer = document.querySelector('.recipe-container');


async function fetchRecipes(query) {
  try {
    recipeContainer.innerHTML = '<h2>Fetching recipes...</h2>';
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();

    recipeContainer.innerHTML = '';

    if (data.meals) {
      data.meals.forEach((meal) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <p><span>${meal.strArea}</span> Dish</p>
          <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `;

        const button = document.createElement('button');
        button.classList.add('view-recipe-btn');
        button.textContent = 'View Recipe';
        recipeDiv.appendChild(button);

        button.addEventListener('click', () => {
          openRecipePopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      recipeContainer.innerHTML = '<h2>No recipes found</h2>';
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipeContainer.innerHTML = '<h2>Error in fetching recipes</h2>';
  }
}

function fetchIngredients(meal) {
  let ingredientsList = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '') {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
}

function openRecipePopup(meal) {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipe-name">${meal.strMeal}</h2>
    <h3>Ingredients</h3>
    <ul class="ingredient-list">
      ${fetchIngredients(meal)}
    </ul>
    <div class="recipe-instructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <div class="recipe-image">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    </div>
  `;

  const recipeDetailsContainer = document.querySelector('.recipe-details-container');
  if (recipeDetailsContainer) {
    recipeDetailsContainer.style.display = 'block';  
  } else {
    recipeContainer.innerHTML = '<h2>Recipe details container not found!</h2>';
  }
}


recipeCloseBtn.addEventListener('click', () => {
  const recipeDetailsContainer = document.querySelector('.recipe-details-container');
  if (recipeDetailsContainer) {
    recipeDetailsContainer.style.display = 'none';  
  }
});

searchbtn.addEventListener('click', (e) => {
  e.preventDefault(); 
  const query = searchbox.value.trim();
  if (query) {
    fetchRecipes(query);
  } else {
    recipeContainer.innerHTML = '<h2>Please enter a search term.</h2>';
  }
});
