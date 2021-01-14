//! ===========================================================================
//! RESULTS ITEM COMPONENT - renders items on search
//! ===========================================================================
class ResultsItem {
    constructor(recipe) {
        this.recipe = recipe;
        this.parent = document.querySelector('.results__list');
    }

    render() {
        const listItem = document.createElement(`LI`);
        this.parent.appendChild(listItem);

        listItem.innerHTML = `
      <a class="results__link results__link--active" href="#23456">
          <figure class="results__fig">
              <img src="${this.recipe.image_url}" alt="Test">
          </figure>

          <div class="results__data">
              <h4 class="results__name">${this.recipe.title}</h4>
              <p class="results__author">${this.recipe.publisher}</p>
          </div>
      </a>
    `;
        listItem.addEventListener("click", () => getRecipe(this.recipe.id));

    }
}


//! ===========================================================================
//! RECIPE ITEM COMPONENT - renders the recipe upon click of a result item
//! ===========================================================================
class Recipe {
    constructor(recipe) {
        this.recipe = recipe;
        this.parent = document.querySelector('.recipe');
    }

    render() {

        const ingredientsParent = document.createElement('ul');
        ingredientsParent.className = 'recipe__ingredient-list';

        for (const ingredient of this.recipe.ingredients) {
            const li = document.createElement('li');
            ingredientsParent.appendChild(li);

            li.className = 'recipe__item'
            li.innerHTML = `
                <svg class="recipe__icon">
                    <use href="./image/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__count">${ingredient.quantity}</div>
                <div class="recipe__ingredient">
                    <span class="recipe__unit">${ingredient.unit}</span>
                    ${ingredient.description}
                </div>
            `
        }

        this.parent.insertAdjacentHTML(`beforeend`, `
            <figure class="recipe__fig">
                <img src="${this.recipe.image_url}" alt="Tomato" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${this.recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="./image/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${this.recipe.cooking_time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="./image/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${this.recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny">
                            <svg>
                                <use href="./image/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny">
                            <svg>
                                <use href="./image/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="./image/icons.svg#icon-heart-outlined"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">

                ${ingredientsParent.outerHTML}

                <button class="btn-small recipe__btn">
                    <svg class="search__icon">
                        <use href="./image/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${this.recipe.publisher}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${this.recipe.source_url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="./image/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>`  );

        // attache eventlistner for like buton  
       const btnLike =  document.querySelector('.recipe__love');
       btnLike.addEventListener("click", () => myLike(this.recipe));  
    }
}