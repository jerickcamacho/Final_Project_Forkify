async function search(event) {
    try {
        event.preventDefault();
        const input = document.querySelector('.search__field')
        const response = await axios.get(`${baseUrl}/recipes?search=${input.value}`);
        const dataRecipes = response.data.data.recipes

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
        const response = await axios.get(`${baseUrl}/recipes/${recipeID}`);
        new Recipe(response.data.data.recipe).render();
    }

    catch (error) {
        alert('Error in getRecipe, Please check console')
        console.error(error);
    }
}
