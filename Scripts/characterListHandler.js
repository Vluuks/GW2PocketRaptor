let app;

function initialize() {
    app = new Vue({
        el: '#charoverview-container',
        data: {
            characters: []
        }
    });
}

function addCharacter() {
    Vue.set(app.characters, app.characters.length, "test")

}