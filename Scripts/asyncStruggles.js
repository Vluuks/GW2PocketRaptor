// Array of requests
var requests = Array();
requests.push($.get('responsePage.php?data=foo'));
requests.push($.get('responsePage.php?data=bar'));

var defer = $.when.apply($, requests);
defer.done(function(){

    // This is executed only after every ajax request has been completed

    $.each(arguments, function(index, responseData){
        // "responseData" will contain an array of response information for each specific request
    });

});