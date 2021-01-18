
class Application {

    constructor() {
        this.baseurl = 'https://forkify-api.herokuapp.com/api/v2';
        this.likestorage = [];
        this.shoppinglistStorage = [];
        this.resultsPage = 1;
        this.resultpage = {};
    }


    onload() {

        // initialize the form
        document.querySelector('.search').onsubmit = search;

    }
}

const App = new Application();

window.onload = App.onload