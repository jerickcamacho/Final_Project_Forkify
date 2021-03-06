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
            <a class="results__link" href="#23456" data-id="${this.recipe.id}">
                <figure class="results__fig">
                    <img src="${this.recipe.image_url}" alt="Test">
                </figure>

                <div class="results__data">
                    <h4 class="results__name">${this.recipe.title}</h4>
                    <p class="results__author">${this.recipe.publisher}</p>
                </div>
            </a>
            `;

        // attach onclick event to render this recipe
        listItem.addEventListener("click", () => {
            const items = [...document.querySelectorAll('.results__link')]

            // remove active class from other results item
            for (const a of items) {
                if (a.classList.contains('results__link--active'))
                    a.classList.remove('results__link--active')
            }

            // apply active class to current item
            const item = document.querySelector(`[data-id='${this.recipe.id}']`)
            item.classList.add('results__link--active')

            // fetch recipe
            getRecipe(this.recipe.id);
        });
    }
}





//! ===========================================================================
//! LIKE ITEM COMPONENT - renders items on like/heart icon on hover
//! ===========================================================================
class LikeItem {
    constructor(recipe) {
        this.recipe = recipe;
        this.parent = document.querySelector('.likes__list');
    }

    render() {
        const li = document.createElement('li');
        this.parent.appendChild(li);

        li.innerHTML = `
            <a class="likes__link" href="#23456">
                <figure class="likes__fig">
                    <img src="${this.recipe.image_url}" alt="Test">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${this.recipe.title}</h4>
                    <p class="likes__author">${this.recipe.publisher}</p> 
                </div>
            </a>
        `

        // attach onclick event to render this recipe
        li.addEventListener("click", () => getRecipe(this.recipe.id))
    }
}




//! ===========================================================================
//! RECIPE ITEM COMPONENT - renders the recipe upon click of a result item
//! ===========================================================================
class Recipe {
    constructor(recipe) {
        this.recipe = recipe;
        this.parent = document.querySelector('.recipe');
        this.isLiked = App.likestorage.some(r => r.id == this.recipe.id)
    }

    render() {
        this.parent.innerHTML = ``;
        const ingredientsParent = document.createElement('ul');
        ingredientsParent.className = 'recipe__ingredient-list';

        for (const ingredient of this.recipe.ingredients) {
            new RecipeIngredient(ingredient, ingredientsParent).render()
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
                    <span class="recipe__info-data recipe__info-data--people">
                        ${this.recipe.servings}
                    </span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny" id="serving_sub">
                            <svg>
                                <use href="./image/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny"  id="serving_add">
                            <svg>
                                <use href="./image/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>

                <button class="recipe__love">
                    <svg class="header__likes" id="icon_heart_${this.recipe.id}">
                    ${this.isLiked
                ? '<use href="./image/icons.svg#icon-heart"></use>'
                : '<use href="./image/icons.svg#icon-heart-outlined"></use>'
            }
                    </svg>
                </button>

            </div>

            <div class="recipe__ingredients">

                ${ingredientsParent.outerHTML}

                <button class="btn-small recipe__btn" id="btn-shoppingList">
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
            </div>`
        );

        // attach eventlistner to like/dislike this recipe  
        const btnLike = document.querySelector('.recipe__love');
        btnLike.addEventListener("click", () => addToLikes(this.recipe));

        // attach eventlistner add the ingredients to shopping list
        const btnShoppingList = document.getElementById('btn-shoppingList');
        btnShoppingList.addEventListener("click", () => addToShoppingList(this.recipe));

        // attach eventlistener for add/sub servings
        const btnServingAdd = document.getElementById('serving_add');
        const btnServingSub = document.getElementById('serving_sub');
        btnServingAdd.addEventListener('click', () => this.updateServings('ADD'));
        btnServingSub.addEventListener('click', () => this.updateServings('SUB'));
    }


    updateServings(action) {
        if (this.recipe.servings == 1 && action == 'SUB') return null

        const newServings = action === 'SUB'
            ? this.recipe.servings - 1
            : this.recipe.servings + 1;

        // add/sub relatative to step/newservings/current servings
        this.recipe.ingredients = this.recipe.ingredients.map(ing => {
            if (ing.quantity != null) {
                ing.quantity *= (newServings / this.recipe.servings)
                return ing
            }

            return ing
        })

        this.recipe.servings = newServings;

        // render to DOM
        const parent = document.querySelector('.recipe__ingredient-list');
        const labelServings = document.querySelector('.recipe__info-data--people');

        parent.innerHTML = ``;
        labelServings.textContent = this.recipe.servings

        for (const ingredient of this.recipe.ingredients) {
            new RecipeIngredient(ingredient, parent).render()
        }
    }
}





//! ===========================================================================
//! RECIPE INGREDIENT ITEM COMPONENT - dynamic recipe item on recipe
//! ===========================================================================
class RecipeIngredient {

    constructor(ingregient, parent) {
        this.ingredient = ingregient
        this.parent = parent
    }

    render() {
        const li = document.createElement('li');
        this.parent.appendChild(li);

        li.className = 'recipe__item'
        li.innerHTML = `
            <svg class="recipe__icon">
                <use href="./image/icons.svg#icon-check"></use>
            </svg>
            <div class="recipe__count">${this.ingredient.quantity != null ? decimalToFraction(this.ingredient.quantity) : ''}</div>
            <div class="recipe__ingredient">
                <span class="recipe__unit">${this.ingredient.unit}</span>
                ${this.ingredient.description}
            </div>
        `
    }
}








//! ===========================================================================
//! SHOPPING LIST ITEM COMPONENT - renders items on shopping list
//! ===========================================================================
class ShoppingListItem {
    constructor(ingredient) {
        this.ingredient = ingredient;
        this.parent = document.querySelector(".shopping__list");
    }

    render() {
        const shoppingItem = document.createElement('li');
        this.parent.appendChild(shoppingItem);

        shoppingItem.className = 'shopping__item';
        shoppingItem.id = `ing_${this.ingredient.id}`;

        shoppingItem.innerHTML = `
            <div class="shopping__count">
                <input type="number" value="${this.ingredient.quantity}" step="${this.ingredient.step}" min="${this.ingredient.step}">
                <p>${this.ingredient.unit}</p>
            </div>
                <p class="shopping__description">${this.ingredient.description}</p>
            <button class="shopping__delete btn-tiny" id="deletebtn-${this.ingredient.id}">
                <svg>
                    <use href="./image/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>`;


        // attach event listener for deleting this ingredient
        const btn_delete = document.getElementById(`deletebtn-${this.ingredient.id}`);

        btn_delete.addEventListener('click', () => {
            document.getElementById(`ing_${this.ingredient.id}`).remove();

            App.shoppinglistStorage = App.shoppinglistStorage
                .filter(ing => ing.id != this.ingredient.id)

        })
    }

}





//! ===========================================================================
//! NEXT PAGE BTN COMPONENT - navigate results item to next page
//! ===========================================================================
class BtnNext {
    render(numPage, numResults) {

        // render only if first page or page inbetween
        if (
            numPage == 1 ||
            numPage >= 2 && numPage < numResults ||
            numPage !== numResults
        ) {

            const parent = document.querySelector('.results__pages');
            const button = document.createElement('button');
            button.className = `btn-inline results__btn--next`;

            button.innerHTML = `
                <span>Page ${numPage + 1}</span >
                <svg class="search__icon">
                    <use href="./image/icons.svg#icon-triangle-right"></use>
                </svg>
            `

            parent.appendChild(button);

            // attach onclick event listener
            button.onclick = () => toPaginate('NEXT')
        }
    }
}





//! ===========================================================================
//! NEXT PREV BTN COMPONENT - navigate results item to prev page
//! ===========================================================================
class BtnPrev {
    render(numPage, numResults) {

        // render only if last page or page inbetween
        if (
            numPage == numResults ||
            numPage >= 2 && numPage < numResults
        ) {

            const parent = document.querySelector('.results__pages');
            const button = document.createElement('button');
            button.className = `btn-inline results__btn--prev`;

            button.innerHTML = `
                <svg class="search__icon">
                    <use href="./image/icons.svg#icon-triangle-left"></use>
                </svg>
                <span>Page ${numPage - 1}</span>
            `

            parent.appendChild(button);

            // attach onclick event listener
            button.onclick = () => toPaginate('PREV')
        }
    }
}






//! ===========================================================================
//! LOADER COMPONENT - assists in waiting api responses
//! ===========================================================================
class Loader {
    constructor(parentElement) {
        this.parent = document.querySelector(parentElement);
    }

    render() {
        const div = document.createElement('div');
        div.classList.add('loader')

        div.innerHTML = `
            <svg>
                <use href="image/icons.svg#icon-cw"></use>
            </svg>
        `

        this.parent.appendChild(div);
        this.loaderElement = div;
    }
}