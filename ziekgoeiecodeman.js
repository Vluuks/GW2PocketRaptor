/* 
	Data Processing final project
	Renske Talsma
	10896503
	
	DATA: Official GW2 API
	https://wiki.guildwars2.com/wiki/API:Main
	
	CREDITS:
	Things that I really used a lot to get things right:
	
	> https://bl.ocks.org/mbostock/4348373
	> http://tributary.io/inlet/4127332/
	> https://www.jasondavies.com/coffee-wheel/
	> https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_tabs_dynamic&stacked=h
	> https://jsfiddle.net/8sh069ns/
    > http://plnkr.co/edit/tct95toQ2IjyUkQJQPB9?p=preview  
	
*/

/* OBJECTS AND CONSTANTS  ********************************************************************************/

/* SCRIPT *********************************************************************************************************/

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

/***** VISUALIZATIONS **************************************************************************************************/

/* Updates the sidebar with information about the current account that is being viewed.*/
function showAccountInfo() {

    // Hide loading spinner.
    $('#accountloading').hide();

    // Select account data paragraph and set the text.
    $('#accountdiv').show();
    $('#accname').text(account.name);
    $('#chars').text(account.characterAmount + " characters");
    $('#accage').text(account.hoursPlayed + " hours played");
    $('#fraclevel').text("Fractal Level " + account.fractalLevel);

}

/* Draws the bar chart that shows each character and their level of agony resist. The maximum 
amount is infinite in theory but more than 150 makes no sense, so the max of the chart is set at 150. */
function makeBarChart(data) {

    // Hide and show dom elements.
    $('#barchartloading').hide();
    $('#sunburstwait').show();

    // Set the dimensions of the canvas.
    var margin = {
            top: 20,
            right: 20,
            bottom: 50,
            left: 50
        },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Set the domain and range.
    var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .05)
		.domain(data.map(function(d) {
			return d.characterName;
		}));
		
    var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, 150]);

    // Define the axes.
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(15);

    // Add the SVG element.
    var svg = d3.select("#barchartpart").append("svg")
        .attr("id", "barchartsvg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add tooltip.
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-2, 0])
        .html(function(d) {
            return "<span>" + d.agonyResist + "</span>";
        });
    svg.call(tip);

    // Add the Y axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -43)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#666666")
        .text("total Agony Resistance");

    // Add bar chart.
    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.characterName);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.agonyResist);
        })
        .attr("height", function(d) {
            return height - y(d.agonyResist);
        })
        .style("fill", function(d) {
            return colorDictionary[account.characterDictionary[d.characterName].profession];
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on("click", function(d) {
            transformDataForSunburst(d.characterName);
        });

    // Add X axis, done after bar chart so text is over it instead of under it.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("dx", "1em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)")
        .on("click", function(d) {
            transformDataForSunburst(d);
        });
}

/* Makes the indices of the fractal achievement that have been completed into an array of booleans so
that both incomplete and complete achievements can be shown accurately. */
function prepareFractalAchievements(dataArray) {

    // Turn the array into a more useful/uniform data format.
    for (var i = 0; i < dataArray.length; i++) {

        // Initialize an array full of true. 
        achievementBoolArray = new Array(25);
        for (var j = 0; j < achievementBoolArray.length; j++) {
            achievementBoolArray[j] = true;
        }

        // Set incomplete achievements to false for indices in subarrays.
        for (var k = 0; k < dataArray[i].length; k++) {
            achievementBoolArray[dataArray[i][k]] = false;
        }

        dataArray[i] = achievementBoolArray;
    }

    // Now we can display the data.
    $('#achievementloading').hide();
    makeAchievementGraph(dataArray);
}

/* Renders the current status of all fractal tier achievements. */
function makeAchievementGraph(data) {

    var color = {
        "false": "#5b5b5b",
        "true": "#6cc63b"
    };

    var tiers = ["Initiate", "Adept", "Expert", "Master"];

    var width = 800,
        height = 70;

    for (var j = 0; j < data.length; j++) {

        // Add svg to webpage.
        var svg = d3.select("#achievementpart").append("svg")
            .attr("class", "achievementsvg")
            .attr("width", width)
            .attr("height", height)

        // Set achievement section title.
        svg.append('text')
            .text(tiers[j])
            .style("fill", "black")
            .style("font-size", "14px")
            .attr("y", 10);

        var rects = svg.selectAll('g')
            .data(data[j])
            .enter()
            .append("g");

        rects.append('rect')
            .attr("y", 16)
            .attr("x", function(d, i) {
                return i * 32;
            })
            .attr("width", 25)
            .attr("height", 25)
            .style("opacity", "1")
            .style("fill", function(d) {
                return color[d.toString()];
            });

        rects.append('text')
            .text(function(d, i) {
                return i + 1 + (j * 25);
            })
            .style("fill", "black")
            .style("font-size", "10px")
            .attr("y", 26)
            .attr("x", function(d, i) {
                return 5 + i * 32;
            });
    }
}

/* Function that transforms the obtained data about agony resist and armor pieces and combines them into a
structure that is suitable for a sunburst visualization. This needs to be done after since the item object itself and
the agony resist are not retrieved at the same time, so making this can only occur after calculating AR is done. 
Request is done on a per character basis because sunburst is only made once a specific bar is clicked. However,
the result is stored  after creating it once so it does not need to be remade every time after.  */
function transformDataForSunburst(character) {

    // Set loading spinner.
    $('#sunburstloading').show();
    var sunburstObject = new SunburstBase();
    
    // Check if the data has been cached to avoid recreating the object for nothing.
    if (account.characterDictionary[character].sunburstDataCache == undefined) {
        
        console.log("new character");

        // Get the equipment array containing objects form the character dictionary.
        var equipment = account.characterDictionary[character].equipmentRarity;

        // Loop over the equipment pieces and construct data accordingly.
        for (var piece in equipment) {
            var currentPiece = equipment[piece];

            // If it's an armor piece but not an underwater piece
            if (currentPiece.type == "Armor" && currentPiece.slot != "HelmAquatic") {
                sunburstObject.children[0].children.push(currentPiece);
            }
            // If it's a trinket or backpiece
            else if (currentPiece.type == "Trinket" || currentPiece.type == "Back") {
                sunburstObject.children[1].children.push(currentPiece);
            }
            // If it's a weapon but not an underwater weapon
            else if (currentPiece.type == "Weapon" && !(currentPiece.slot == "Trident" || currentPiece.slot == "Harpoon" || currentPiece.slot == "Speargun")) {
                sunburstObject.children[2].children.push(currentPiece);
            }
            // If it's an underwater equipment piece
            else if (currentPiece.slot == "HelmAquatic" || currentPiece.slot == "Trident" || currentPiece.slot == "Harpoon" || currentPiece.slot == "Speargun") {
                sunburstObject.children[3].children.push(currentPiece);
            }
        }

        // Cache it so that it does not need to be remade if we reclick this character.
        account.characterDictionary[character].sunburstDataCache = sunburstObject;

    } 
	else {
        sunburstObject = account.characterDictionary[character].sunburstDataCache;
    }

    // Create the sunburst visualization with this data.
    makeSunburst(sunburstObject);
    showCharacterData(character);

}

/* Function that creates a sunburst visualization with data about a character. The data contains
information about all the gear that a character has on them, and the rarity and name of these
items. */
function makeSunburst(data) {
    
    console.log(data);

    // Hide the information message.
    $('#sunburstwait').hide();
    $('#sunburstloading').hide();

    // Check if there was already a sunburst, if so then remove it.
    var svgChart = $("#sunburstsvg");
    if (svgChart !== undefined)
        svgChart.remove();

    // Set dimensions of the visualization.
    var width = 600,
        height = 600,
        radius = Math.min(width, height) / 2;

    // Make x and y scales.
    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.linear()
        .range([0, radius]);

    // Add svg to webpage.
    var svg = d3.select("#piechartpart").append("svg")
        .attr("width", width)
        .attr("height", height + 20)
        .attr("id", "sunburstsvg")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
		
	// Tooltip.
	var tooltip = d3.select("#piechartpart").append("div")
	  .attr("class", "tooltip")
	  .style("opacity", 0);

    var partition = d3.layout.partition()
        .value(function(d) {
            return d.size;
        });

    var arc = d3.svg.arc()
        .startAngle(function(d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
        })
        .endAngle(function(d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
        })
        .innerRadius(function(d) {
            return Math.max(0, y(d.y));
        })
        .outerRadius(function(d) {
            return Math.max(0, y(d.y + d.dy));
        });

    // Add data to the svg.
    var g = svg.selectAll("g")
        .data(partition.nodes(data))
        .enter().append("g");

    var path = g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {

            // Determine the color of the data point.
            if (d.name == "Weapons" || d.name == "Armor" || d.name == "Aquatic" || d.name == "Trinkets") {
                return colorDictionary[(d.children ? d : d.parent).name];
            }
            if (d.name == "Equipment") {
                return "#DDDDDD";
            } 
			else {
                return colorDictionary[d.rarity];
            }
        })
        .on("click", click)
		.on("mouseover", function(d){ 
			tooltip
				.text(d.name)
				.style("opacity", 1)
				.style("left", (d3.event.pageX) + 0 + "px")
				.style("top", (d3.event.pageY) - 0 + "px");
			
		})
		.on("mouseout", function(d) {
			tooltip.style("opacity", 0);
		});


    // Append text to  each block of the sunburst. 
    var text = g.append("text")
        .attr("class", "sunbursttext")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
        .attr('text-anchor', function (d) { return computeTextRotation(d) > 180 ? "end" : "start"; })
        .attr('dx', function (d) { return computeTextRotation(d) > 180 ? "40" : "-40"; })
        .attr("dy", ".35em")
        .text(function(d) {
            if (d.name == "Equipment") {
                return "";
            }
            else if (d.name.length > 13) {
                return d.name.substring(0, 13) + "...";
            } 
            else {
                return d.name;
            }
        });

    // Function that handles clicks on the sunburst so that it can zoom.
    function click(d) {

        // Fade out text elements.
        text.transition()
            .attr("opacity", 0);

        // Make a transition to the new view.
        path.transition()
            .duration(750)
            .attrTween("d", arcTween(d))
            .each("end", function(e, i) {
				
                // Check if it lies within the angle span.	
                if (e.x >= d.x && e.x < (d.x + d.dx)) {

                    // Get a selection of the associated text element.
                    var arcText = d3.select(this.parentNode).select("text");

                    // Fade in the text element and recalculate positions.
                    arcText.transition().duration(300)
                        .attr("opacity", 1)
                        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
                        .attr('text-anchor', function (d) { return computeTextRotation(d) > 180 ? "end" : "start"; })
                        .attr('dx', function (d) { return computeTextRotation(d) > 180 ? "40" : "-40"; })
                }
            });
    }

    // Interpolate the scales. 
    function arcTween(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(d, i) {
            return i ?
                function(t) {
                    return arc(d);
                } :
                function(t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                    return arc(d);
                };
        };
    }

    function computeTextRotation(d) {
        var ang = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
        return (ang > 90) ? 180 + ang : ang;
    } 
}

/* Show data about the character to accompany the sunburst. */
function showCharacterData(character) {

    // Select the div and append html.
    $('#sunburstextra').html(
        '<p class=\"charname\">' + character + '</p>' +
        '<p class=\"charage"> Level ' + account.characterDictionary[character].level + '</p>' +
        '<p class =\"charprofession\" style=\"color:' + colorDictionary[account.characterDictionary[character].profession] + ' \">' + account.characterDictionary[character].profession + '</p>' +
        '<p class =\"charage\"> Played for ' + account.characterDictionary[character].hoursPlayed + ' hours </p>'
    );
    $('#sunburstextra').show();
}