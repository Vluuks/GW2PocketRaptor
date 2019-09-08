let app;

function initialize() {
    app = new Vue({
        el: '#charoverview-container',
        data: {
            characters: []
        }
    });
}

function addCharacter(character) {

    console.log(character)
    let char = character; // if i push character directly, it does not work?
    Vue.set(app.characters, app.characters.length, char)

}