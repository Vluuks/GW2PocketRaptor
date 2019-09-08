/* 
    Wait until page is ready. 
*/
$('document').ready(function() {

    // Manage DOM element visibilities.
    $('#error').hide();
    $('#accountloading').hide();
    $('#sunburstextra').hide();
    $('#sunburstwait').hide();
    $('#barchartloading').hide();
    $('#achievementloading').hide();
    $('#sunburstloading').hide();


    // Initialize vue
    initialize();

});

/* 
    Small function that takes a string and shows it in the error span on top of the page. 
*/
function showError(errorMessage) {
    $('#error').show();
    $('#error').text(errorMessage);
}
