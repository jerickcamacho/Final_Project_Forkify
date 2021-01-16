async function search(event) {
    try {
        event.preventDefault();
        const input = document.querySelector('.search__field')
        const response = await axios.get(`${App.baseurl}/recipes?search=${input.value}`);
        const dataRecipes = response.data.data.recipes

        const resultstList = document.querySelector('.results__list');
        resultstList.innerHTML = '';

        for (let dataValue of dataRecipes) {
            new ResultsItem(dataValue).render();
        }
    }

    catch (error) {
        alert('Error in searching, Please check console')
        console.error(error);
    }
}

async function getRecipe(recipeID) {

    try {
        const response = await axios.get(`${App.baseurl}/recipes/${recipeID}`);
        new Recipe(response.data.data.recipe).render();
    }

    catch (error) {
        alert('Error in getRecipe, Please check console')
        console.error(error);
    }
}

function addToLikes(recipe) {
    const likesParent = document.querySelector('.likes__list');
    const foundRecipe = App.likestorage.find(element => element.id == recipe.id)
    const heartIcon = document.querySelector(`#icon_heart_${recipe.id}`);

    // check if user already like the recipe 
    if (foundRecipe) {
        App.likestorage = App.likestorage.filter(element => element.id != recipe.id)
        heartIcon.innerHTML = `<use href="./image/icons.svg#icon-heart-outlined"></use`
    }

    else {
        App.likestorage.push(recipe)
        heartIcon.innerHTML = `<use href="./image/icons.svg#icon-heart"></use>`
    }

    // rerender liked items
    likesParent.innerHTML = ``;

    for (const likedRecipe of App.likestorage) {
        new LikeItem(likedRecipe).render();
    }
}

function addToShoppingList(recipe) {

    const shoppingLists = document.querySelector('.shopping__list');
    shoppingLists.innerHTML = '';

    for (const ingredient of recipe.ingredients) {
        ingredient.id = Math.random().toString().substr(2, 15);
        App.shoppinglistStorage.push(ingredient)
        new ShoppingListItem(ingredient).render();
    }
}