async function search(event) {
    try {
        event.preventDefault();
        const input = document.querySelector('.search__field')
        const response = await axios.get(`${baseUrl}/search?q=${input.value}`);
        const dataRecipes = response.data.recipes

        for (let dataValue of dataRecipes) {
            new ResultsItem(dataValue).render();
        }
    }

    catch (error) {
        alert('Error in searching, Please check console')
        console.error(error);
    }
}

async function getRecipe(recipeID){

    try{

        const response = await axios.get(`${baseUrl}/get?rId=${recipeID}`); 
        // console.log(response)
        new Recipe(response.data.recipe).render();  

    } 
    
    catch(error){
        alert('Error in getRecipe, Please check console')
        console.error(error);
    }
}
