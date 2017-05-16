/* 

Created by Renske Spring 2017

This file retrieves all the necessary data from the Guild Wars 2 API. This data is used
to create various data visualizations.

*/

/* Wait until page is ready. */
$('document').ready(function() {

    // Manage DOM element visibilities.
    $('#error').hide();
    $('#accountdiv').hide();
    $('#accountloading').hide();
    $('#sunburstextra').hide();
    $('#sunburstwait').hide();
    $('#barchartloading').hide();
    $('#achievementloading').hide();
    $('#sunburstloading').hide();

});

/* Small function that takes a string and shows it in the error span on top of the page. */
function showError(errorMessage) {
    $('#error').show();
    $('#error').text(errorMessage);
}

/* DATA RETRIEVAL **********************************************************************************************/

/* Check the given API and then start retrieving data if it has been verified. 
This function is invoked by pressing the button on the webpage. */
function getUserApi() {
	
    // Check if svgs were already made, if so, delete.
    if ($("#barchartsvg")) {
        $("#barchartsvg").remove();
    }
    if ($("#sunburstsvg")) {
        $("#sunburstsvg").remove();
    }
    if ($(".achievementsvg")) {
        $(".achievementsvg").remove();
    }

    // Hide and show corresponding DOM elements.
    $('#error').hide();
    $('#accountdiv').hide();
    $('#sunburstextra').hide();
    $('#accountloading').show();
    $('#barchartloading').show();
    $('#achievementloading').show();

    // Grab api key from field and check.
    var apiKey = $("#apiKey").val().trim();
    
    apiKey = "F42B9440-82CB-0D4A-AA45-1594E292B1FB08137C88-69C5-4779-8740-43FA4C501EE0";
    // apiKey = "A2D523A7-B023-554F-898C-A7D631E287B40F27ED03-D8EA-4304-B0B6-E839DA12F709";

    if (apiKey == "" || apiKey == undefined) {
        showError("Please do not omit the field");
    } 
	else {

		// Check if API is valid using regex. 
        if (/^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{20}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/.test(apiKey)) {

            $.ajax({
                type: "GET",
                async: true,
                url: "https://api.guildwars2.com/v2/tokeninfo?access_token=" + apiKey,
                cache: false,
                dataType: 'text',

                success: function() {},
                error: function() {
                    showError("The GW2 API seems to be down, please come back at a later time.");
                },
                // Further check if it's a valid key even if it passed regex.
                complete: function(data) {

                    var apiResult = JSON.parse(data.responseText);

                    // If the key matches the expected format but is still invalid.
                    if (apiResult.text && (apiResult.text.equals("endpoint requires authentication") || apiResult.text.equals("invalid key")))
                        showError("Your API key is not valid or is missing permissions.");

                    // If the permissions array exists in JSON.
                    if (apiResult.permissions) {

                        // Check for the necessary permissions.
                        var permissionCount = 0;
                        for (var i = 0; i < apiResult.permissions.length; i++) {

                            //Possible permissions can be found at https://wiki.guildwars2.com/wiki/API:2/tokeninfo
                            switch (apiResult.permissions[i]) {
                                case "characters":
                                    permissionCount++;
                                    break;
                                case "account":
                                    permissionCount++;
                                    break;
                                case "builds":
                                    permissionCount++;
                                    break;
                                case "progression":
                                    permissionCount++;
                                    break;
                            }
                        }

                        // Check if permission requirements were met, if so, invoke callback function.
                        if (permissionCount == 4) {
                            apiCheckCallback(apiKey);
                        } 
						else {
                            showError("Your API key is missing permissions.");
                        }
                    }
                }
            });
        }

        // If API key didn't pass regex it can never be valid.
        else {
            showError("Your API key is not valid");
        }
    }
}

/* Called after the API key has been verified and handles the subsequent calls to other functions
which retrieve more information from the API. */
function apiCheckCallback(apiKey) {

    // Make api global now that it has been verified.
    account.apiKey = apiKey;

    // Get characters and in turn character equipment.
    getCharacters(getGeneralCharacterInfo);

    // Get general account info such as name, amount of chars, age etc.
    getGeneralAccountInfo(showAccountInfo);

    // Retrieve the fractal achievements and perform display cb.
    getFractalAchievements(prepareFractalAchievements);
}

/* Retrieves general information about the account, such as name, age, etc. */
function getGeneralAccountInfo(callback) {

    $.ajax({
        type: "GET",
        async: true,
        url: "https://api.guildwars2.com/v2/account?access_token=" + account.apiKey,
        cache: false,
        dataType: 'text',

        success: function() {},
        error: function() {
            showError("Something went wrong fetching the account info.");
        },
        complete: function(data) {

            accountInfo = JSON.parse(data.responseText);
            account.name = accountInfo.name;
            account.hoursPlayed = (accountInfo.age / 3600).toFixed(0);
            account.fractalLevel = accountInfo.fractal_level;

            // Notify that the data has been retrieved and we can display it.
            callback();
        }
    });
}

/* This function retrieves a list of the characters on the account from the API and then
calls the callback which will retrieve additional info based on the character names. */
function getCharacters(callback) {

    $.ajax({
        type: "GET",
        async: true,
        url: "https://api.guildwars2.com/v2/characters?access_token=" + account.apiKey,
        cache: false,
        dataType: 'text',

        success: function() {},
        error: function() {
            showError("Something went wrong fetching the character info.");
        },
        complete: function(data) {

            // Make characters into an array, sort it so it aligns with the dictionary.
            characterArray = JSON.parse(data.responseText);;
            account.characters = characterArray.sort();
            account.characterAmount = characterArray.length;

            // Fetch general info and equipment.
            callback();
        }
    });
}

/* Retrieves information about a character based on the name of the character and
stores the information in a character object which will be globally accessible by the
other functions in the script. */
function getGeneralCharacterInfo() {

    var characterArray = account.characters;
    var counter = 0;

    // Loop over all characters, using anonymous function for async closure.
    for (let i = 0; i < account.characterAmount; i++) {
        (function(i) {

            $.ajax({
                type: "GET",
                async: true,
                url: "https://api.guildwars2.com/v2/characters/" + characterArray[i] + "?access_token=" + account.apiKey,
                cache: false,
                dataType: 'text',
                success: function() {},
                error: function() {
                    showError("Something went wrong fetching the character info.");
                },
                complete: function(data) {

                    // Convert json data to javascript object.
                    var characterObject = JSON.parse(data.responseText);
                    counter++;

                    // Add properties to the object.
                    var character = new Character();
                    
                    character.race = characterObject.race;
                    character.level = characterObject.level;
                    character.equipment = characterObject.equipment;
                    character.profession = characterObject.profession;
                    character.hoursPlayed = (characterObject.age / 3600).toFixed(0);
                    
                    // Add to account dictionary.
                    account.characterDictionary[characterObject.name] = character;

                    // If we finished the last character, perform callback.
                    if (counter == characterArray.length) {
                        fetchEquipment();
                    }
                }
            });
        })(i);
    }
}

/* This function extracts the equipment array from the dictionary of characters and their info
and checks for every piece what type it is and whether it is of ascended (best in slot) rarity. 
For every item we look up the rarity and the type and this is stored in an object which in turn is stored
in the dictionary with the character name as a key. This dictionary is globally accessible and will, after
the callback, be available for use by the visualizations. */
function fetchEquipment() {

    // Iterate over the characters in the dictionary and access equipment array for each.
    for (let character in account.characterDictionary) {
        (function(character) {
            if (account.characterDictionary.hasOwnProperty(character)) {

                // Grab equipment.
                var equipmentArray = account.characterDictionary[character].equipment;

                // Loop over the equipment array and demand API for item details in bulk.   
                var baseUrl = "https://api.guildwars2.com/v2/items?ids=";
                var infusionsPerPieceDict = {};
                var slotInformationDict = {};

                for (let i = 0; i < equipmentArray.length; i++) {

                    // Append ID to url.
                    baseUrl += equipmentArray[i].id + ",";

                    // Create id indexed dictionary for infusions.
                    infusionsPerPieceDict[equipmentArray[i].id] = equipmentArray[i].infusions;
                    slotInformationDict[equipmentArray[i].id] = equipmentArray[i].slot;
                }

                // Request all the item ids  from the API at once.
                $.ajax({
                    type: "GET",
                    url: baseUrl.slice(0, -1),
                    async: true,
                    cache: false,
                    dataType: 'text',

                    success: function() {},
                    error: function() {
                        showError("Something went wrong fetching the equipment info.");
                    },
                    complete: function(data) {
                        multipleItemObject = JSON.parse(data.responseText);

                        // Loop over the returned values and make separate item objects out of it.
                        for (item in multipleItemObject) {

                            var itemObject = multipleItemObject[item];

                            // Store item properties in object and store object in the array of items on the character.
                            if (itemObject.type == ("Armor") || itemObject.type == ("Trinket") || itemObject.type == ("Weapon") || itemObject.type == ("Back")) {
                                
                                var itemObject = new Item(
                                    itemObject.id,
                                    itemObject.name,
                                    itemObject.rarity,
                                    infusionsPerPieceDict[itemObject.id], 
                                    itemObject.type,
                                    itemObject.details["type"],
                                    slotInformationDict[itemObject.id]
                                )
                                
                                // Push to equipment array. 
                                account.characterDictionary[character].equipmentRarity.push(itemObject);
                            }
                        }

                        // If it's the last character, notify callback.
                        if (character == account.characters[account.characterAmount - 1]) {
                            onDataReady();
                        }
                    }
                });
            }
        }(character));
    }
}

/* For a given armor piece, calculate the agony infusions present, and based on the ID of these
infusions return the total amount of agony resist present in the armor piece, trinket or weapon. 
There are many different infusions in this game due to ArenaNet's inconsistent additions and 
revamps of the system, which makes a dictionary necessary to account for all possible types. 
If no infusions are present the infusionsarray will not exist and the function will return 0. */
function calculateAgonyResist(equipment, character) {

    // Instantiate new agonyresist object.
    var agonyResist = new AgonyResist();

    // Iterate over all the items.
    for (item in equipment) {

        // If the item has one or multiple infusions.
        if (equipment[item].infusions != undefined) {

            // Loop over all the infusions in the item.
            for (var i = 0; i < equipment[item].infusions.length; i++) {

                var infusion = equipment[item].infusions[i];

                // Add agony resist back to the item object for later reference.
                equipment[item].agonyResist += infusionDictionary[infusion];

                // If it's a weapon, check which one.
                if (equipment[item].type == "Weapon") {

                    switch (equipment[item].weaponSlot) {

                        case "WeaponA1":
                            agonyResist.weaponsA += infusionDictionary[infusion];
                            break;
                        case "WeaponA2":
                            agonyResist.weaponsA += infusionDictionary[infusion];
                            break;
                        case "WeaponB1":
                            agonyResist.weaponsB += infusionDictionary[infusion];
                            break;
                        case "WeaponB2":
                            agonyResist.weaponsB += infusionDictionary[infusion];
                            break;
                        case "WeaponAquaticA":
                            agonyResist.aquatic += infusionDictionary[infusion];
                            break;
                        case "WeaponAquaticB":
                            agonyResist.aquatic += infusionDictionary[infusion];
                            break;
                    }
                }

                // If it's a trinket or backpiece, add to total. Discard amulet since these infusions are not AR ones.
                else if ((equipment[item].type == "Trinket" && equipment[item].slot != "Amulet") || equipment[item].type == "Back") {
                    agonyResist.trinkets += infusionDictionary[infusion];
                }

                // If it's armor, check for aquabreather and else add to total.
                else if (equipment[item].type == "Armor") {

                    if (equipment[item].slot != "HelmAquatic") {
                        agonyResist.armor += infusionDictionary[infusion];
                    } 
                    else {
                        agonyResist.aquatic += infusionDictionary[infusion];
                    }
                }
            }
        }
    }

    // Calculate the effective total using the weapon set with the biggest amount and discarding underwater weapons.
    agonyResist.total = agonyResist.armor + agonyResist.trinkets;

    // Take the weapon set with the higher agony resist.
    if (agonyResist.weaponsA < agonyResist.weaponsB) {
        agonyResist.total += agonyResist.weaponsB;
    } 
	else if (agonyResist.weaponsA > agonyResist.weaponsB) {
        agonyResist.total += agonyResist.weaponsA;
    } 
	else {
        agonyResist.total += agonyResist.weaponsA;
    }

    return agonyResist;
}

/* When the data is ready, calculate the total agony resist on the gear and store this in an object
that can be visualized in a bar chart. */
function onDataReady() {

    var dataArray = [];
    for (character in account.characterDictionary) {

        // Calculate the total agony resist on the gear.
        var equipment = account.characterDictionary[character].equipmentRarity;
        account.characterDictionary[character].agonyResist = calculateAgonyResist(equipment, character);

        // Create a new data array for the bar chart, using the character name and total agony resist.
        var dataObject = {
            characterName: character,
            agonyResist: account.characterDictionary[character].agonyResist.total
        }

        dataArray.push(dataObject);
    }

    // When calculating the AR is done, we can make the barchart.
    makeBarChart(dataArray);
}

/* Get the array of fractal achievements from the API. */
function getFractalAchievements(callback) {

    // Get the array of API 
    $.ajax({
        type: "GET",
        async: true,
        url: "https://api.guildwars2.com/v2/account/achievements?access_token=" + account.apiKey,
        cache: false,
        dataType: 'text',

        success: function() {},
        error: function() {
            showError("Could not retrieve information about achievements.");
        },
        complete: function(data) {

            var achievementArray = JSON.parse(data.responseText);
            var fractalAchievementArray = new Array(4);

            // Find the fractal achievements in the array (they do not have a fixed index, unfortunately).
            for (var i = 0, length = achievementArray.length; i < length; i++) {
                switch (achievementArray[i].id) {

                    // Initiate
                    case 2965:
                        fractalAchievementArray[0] = achievementArray[i].bits;
                        break;

                        // Adept
                    case 2894:
                        fractalAchievementArray[1] = achievementArray[i].bits;
                        break;

                        // Expert
                    case 2217:
                        fractalAchievementArray[2] = achievementArray[i].bits;
                        break;

                        // Master
                    case 2415:
                        fractalAchievementArray[3] = achievementArray[i].bits;
                        break;
                }
            }

            // When we're done, pass array on.
            callback(fractalAchievementArray);
        }
    });
}

/* This function writes the data that has been retrieved from the API to a text file in JSON format. 
This ensures that even if the API is down the visualization can be run with this data. The back up 
data is stored locally an can be used to replace the finished "account" object in onDataReady.*/
function makeBackUp() {

    var jsonString = JSON.stringify(account);

    if (jsonString != undefined) {
        console.log(jsonString);
    } 
	else {
        console.log("Could not transform to JSON.");
    }
}