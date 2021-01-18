async function search(event) {
    try {
        event.preventDefault();
        new Loader('.results__list').render();
        const input = document.querySelector('.search__field')
        const response = await axios.get(`${App.baseurl}/recipes?search=${input.value}`);
        const dataRecipes = response.data.data.recipes

        // empty out list and pagination buttons
        document.querySelector('.results__list').innerHTML = ``;
        document.querySelector('.results__pages').innerHTML = ``;

        // PAGINATION
        let paginatedRecipes = new Object();
        let groupedRecipes = new Array();
        let groupPage = 1;

        dataRecipes.forEach((recipe, index) => {
            const isLastItemOfPage = (index + 1) % 10 == 0;
            const isLastIteration = index == dataRecipes.length - 1

            if (isLastItemOfPage || isLastIteration) {
                groupedRecipes.push(recipe);
                paginatedRecipes[groupPage] = groupedRecipes;
                groupedRecipes = new Array();
                groupPage++
            }

            if (!isLastItemOfPage && !isLastIteration)
                groupedRecipes.push(recipe);

        })

        App.resultsPage = 1
        App.results = { ...paginatedRecipes }

        for (let dataValue of App.results[App.resultsPage]) {
            new ResultsItem(dataValue).render();
        }

        if (Object.keys(App.results).length == 1) return null

        // render pagination buttons
        new BtnPrev().render(App.resultsPage, Object.keys(App.results).length);
        new BtnNext().render(App.resultsPage, Object.keys(App.results).length);

    }

    catch (error) {
        alert('Error in searching, Please check console')
        console.error(error);
    }
}

async function getRecipe(recipeID) {

    try {

        new Loader('.recipe').render();
        const response = await axios.get(`${App.baseurl}/recipes/${recipeID}`);

        // create a copy of the quantity needed for dynamic servigns
        response.data.data.recipe.ingredients = response.data.data.recipe.ingredients
            .map(ing => { ing.step = ing.quantity; return ing })

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

function toPaginate(action) {

    if (action == 'NEXT') App.resultsPage++;
    if (action == 'PREV') App.resultsPage--;

    // empty out list and pagination buttons
    document.querySelector('.results__list').innerHTML = ``;
    document.querySelector('.results__pages').innerHTML = ``;

    for (let dataValue of App.results[App.resultsPage]) {
        new ResultsItem(dataValue).render();
    }

    // render pagination buttons
    new BtnPrev().render(App.resultsPage, Object.keys(App.results).length);
    new BtnNext().render(App.resultsPage, Object.keys(App.results).length);
}

function decimalToFraction(value, donly = true) {

    if (parseInt(value) == value) return value // if whole number

    let tolerance = 1.0E-6; // from how many decimals the number is rounded
    let h1 = 1;
    let h2 = 0;
    let k1 = 0;
    let k2 = 1;
    let negative = false;
    let i;

    if (value < 0) {
        negative = true;
        value = -value;
    }

    if (donly) {
        i = parseInt(value);
        value -= i;
    }

    let b = value;

    do {
        var a = Math.floor(b);
        var aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(value - h1 / k1) > value * tolerance);

    return (negative ? "-" : '') + ((donly & (i != 0)) ? i + ' ' : '') + (h1 == 0 ? '' : h1 + "/" + k1);
}