// Global app controller 
const API = "https://forkify-api.herokuapp.com/api/search?q=pizza"; 


class ResultsItem {
    constructor(recipe){
        this.recipe = recipe; 
    }

    render(){
        var listItem = document.createElement(`LI`); 
        listItem.innerHTML = `<a class="results__link results__link--active" href="#23456">
        <figure class="results__fig">
            <img src="${this.recipe.image_url}" alt="Test">
        </figure>

        <div class="results__data">
            <h4 class="results__name">${this.recipe.title}</h4>
            <p class="results__author">${this.recipe}</p>
        </div>
        
    </a>`;

    }

    
}
/**************** Get  ***********/ 
async function search() {
    try {
      const response = await axios.get(API);
      console.log(response);
      
      const dataRecipes = response.data.recipes  
      
      for(let dataValue of dataRecipes){
            console.log(dataValue); 
            new ResultsItem(dataValue);
      }

    } 

    catch (error) {
      console.error(error);
    }
  }

search(); // Invoke ko si search function or tawagin 

