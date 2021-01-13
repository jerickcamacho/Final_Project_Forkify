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
    }
}