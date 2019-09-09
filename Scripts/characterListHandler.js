let app;

function initialize() {
    app = new Vue({
        el: '#charoverview-container',
        data: {
            characters: [],
            search: "",
            checkedProfessions: [],
            selected : "none"
        },
        computed: {
            filteredCharacters() {
                return filter(this.characters, this.search, "all");
            }
        },
        methods : {
            
        }

    });

    // Add click handler to the divs?
    // document.getElementsByClassName("character-page-container").addEventListener("click", console.log("test"));
}

function addCharacter(character) {

    console.log(character)
    let char = character; // if i push character directly, it does not work?
    Vue.set(app.characters, app.characters.length, char)

}

function matchStringNoCase(source, comparison){
    return source.toUpperCase().match(comparison.toUpperCase());
}

/*
    Filters items in the collection based on the selected category and search field input. Compares against
    tags, description and item name. 
*/
function filter(collection, searchTerm, category) {

    sort(collection, "profession");
    
    return collection.filter((item) => {

        // Apply category filter
        if(app.checkedProfessions.length > 0)
            return app.checkedProfessions.includes(item.profession.toLowerCase())  && (matchStringNoCase(item.name, searchTerm))

        return matchStringNoCase(item.name, searchTerm) ;
    });

}

function sort(collection, criterion) {
    collection.sort(function(a, b){

        switch(criterion) {

            case "level":
                break;
            case "age" :
                break;
            case "name":
                return a.name.localeCompare(b.name);
            case "profession":
                return a.profession.localeCompare(b.profession);
        }
    })
} 