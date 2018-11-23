/*

Created by Renske Spring 2017

This script creates the various visualizations of the Guild Wars 2 API data.

    > General account info
    > Bar chart showing character agony resist
    > Overview of complete/incomplete fractal achievements
    > Sunburst showing breakdown of gear by character

*/

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

function showCurrencies() {

    $('#fractalrelics').text("Relics " + account.fractalRelics);
    $('#pristinerelics').text("Pristines " + account.fractalPristine);
}

/* redraw when new data is present
 every character iteration?
 or maybe in batches  */

// function updateBarChart() {

//     // Check if there was already a barchart, if so then remove it.
//     var svgChart = $("#barchartsvg");
//     if (svgChart !== undefined)
//         svgChart.remove();

//     data = prepForBarsInefficient();

//     // Hide and show dom elements.
//     $('#barchartloading').hide();
//     $('#sunburstwait').show();

//     // Set the dimensions of the canvas.
//     var margin = {
//             top: 20,
//             right: 20,
//             bottom: 50,
//             left: 50
//         },
//         width = 800 - margin.left - margin.right,
//         height = 400 - margin.top - margin.bottom;

//     // Set the domain and range.
//     var x = d3.scale.ordinal()
// 		.rangeRoundBands([0, width], .05)
// 		.domain(data.map(function(d) {
// 			return d.characterName;
// 		}));

//     var y = d3.scale.linear()
// 		.range([height, 0])
// 		.domain([0, 150]);

//     // Define the axes.
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom")

//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left")
//         .ticks(15);

//     // Add the SVG element.
//     var svg = d3.select("#barchartpart").append("svg")
//         .attr("id", "barchartsvg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform",
//             "translate(" + margin.left + "," + margin.top + ")");

//     // Add tooltip.
//     var tip = d3.tip()
//         .attr('class', 'd3-tip')
//         .offset([-2, 0])
//         .html(function(d) {
//             return "<span>" + d.agonyResist + "</span>";
//         });
//     svg.call(tip);

//     // Add the Y axis.
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis)
//         .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -43)
//         .attr("dy", ".71em")
//     //    .style("text-anchor", "end")
//         .attr("fill", "#666666")
//         .text("total Agony Resistance");

//     // Add bar chart.
//     svg.selectAll("bar")
//         .data(data)
//         .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) {
//             return x(d.characterName);
//         })
//         .attr("width", x.rangeBand())
//         .attr("y", function(d) {
//             return y(d.agonyResist);
//         })
//         .attr("height", function(d) {
//             return height - y(d.agonyResist);
//         })
//         .style("fill", function(d) {
//             return colorDictionary[account.characterDictionary[d.characterName].profession];
//         })
//         .on('mouseover', tip.show)
//         .on('mouseout', tip.hide)
//         .on("click", function(d) {
//             transformDataForSunburst(d.characterName);
//         });

//     // Add X axis, done after bar chart so text is over it instead of under it.
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//         .selectAll("text")
//         .style("text-anchor", "start")
//         .attr("dx", "1em")
//         .attr("dy", "-.55em")
//         .attr("transform", "rotate(-90)")
//         .on("click", function(d) {
//             transformDataForSunburst(d);
//         });
// }



// /* Draws the bar chart that shows each character and their level of agony resist. The maximum
// amount is infinite in theory but more than 150 makes no sense, so the max of the chart is set at 150. */
// function makeBarChart(data) {
    
//     // Hide and show dom elements.
//     $('#barchartloading').hide();
//     $('#sunburstwait').show();

//     // Set the dimensions of the canvas.
//     var margin = {
//             top: 20,
//             right: 20,
//             bottom: 50,
//             left: 50
//         },
//         width = 800 - margin.left - margin.right,
//         height = 400 - margin.top - margin.bottom;

//     // Set the domain and range.
//     var x = d3.scale.ordinal()
// 		.rangeRoundBands([0, width], .05)
// 		.domain(data.map(function(d) {
// 			return d.characterName;
// 		}));

//     var y = d3.scale.linear()
// 		.range([height, 0])
// 		.domain([0, 150]);

//     // Define the axes.
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom")

//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left")
//         .ticks(15);

//     // Add the SVG element.
//     var svg = d3.select("#barchartpart").append("svg")
//         .attr("id", "barchartsvg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform",
//             "translate(" + margin.left + "," + margin.top + ")");

//     // Add tooltip.
//     var tip = d3.tip()
//         .attr('class', 'd3-tip')
//         .offset([-2, 0])
//         .html(function(d) {
//             return "<span>" + d.agonyResist + "</span>";
//         });
//     svg.call(tip);

//     // Add the Y axis.
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis)
//         .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", -43)
//         .attr("dy", ".71em")
//     //    .style("text-anchor", "end")
//         .attr("fill", "#666666")
//         .text("total Agony Resistance");

//     // Add bar chart.
//     svg.selectAll("bar")
//         .data(data)
//         .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) {
//             return x(d.characterName);
//         })
//         .attr("width", x.rangeBand())
//         .attr("y", function(d) {
//             return y(d.agonyResist);
//         })
//         .attr("height", function(d) {
//             return height - y(d.agonyResist);
//         })
//         .style("fill", function(d) {
//             return colorDictionary[account.characterDictionary[d.characterName].profession];
//         })
//         .on('mouseover', tip.show)
//         .on('mouseout', tip.hide)
//         .on("click", function(d) {
//             transformDataForSunburst(d.characterName);
//         });

//     // Add X axis, done after bar chart so text is over it instead of under it.
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//         .selectAll("text")
//         .style("text-anchor", "start")
//         .attr("dx", "1em")
//         .attr("dy", "-.55em")
//         .attr("transform", "rotate(-90)")
//         .on("click", function(d) {
//             transformDataForSunburst(d);
//         });
// }

/* Makes the indices of the fractal achievement that have been completed into an array of booleans so
that both incomplete and complete achievements can be shown accurately. */
function prepareFractalAchievements(dataArray) {

    // Turn the array into a more useful/uniform data format.
    for (var i = 0; i < dataArray.length; i++) {

        // Initialize an array full of true.
        achievementBoolArray = new Array(25);
        for (var j = 0, l = achievementBoolArray.length; j < l; j++) {
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

        // Get the equipment array containing objects form the character dictionary.
        var equipment = account.characterDictionary[character].equipmentRarity;

        // Loop over the equipment pieces and construct data accordingly.
        for (var piece in equipment) {
            var currentPiece = equipment[piece]; // TODO but wtf why then

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

    // Hide the information message.
    $('#sunburstwait').hide();
    $('#sunburstloading').hide();
    $('#tooltipcontent').hide();

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
		.on("mouseover", function(d) {

            showItemTooltip(d);

			tooltip
				.text(d.name)
				.style("opacity", 1)
				.style("left", (d3.event.pageX) + 0 + "px")
                .style("top", (d3.event.pageY) - 0 + "px");

		})
		.on("mouseout", function(d) {
            // hideItemTooltip();
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
        })
        .on("click", click)
		.on("mouseover", function(d) {
            showItemTooltip(d);
			tooltip
				.text(d.name)
				.style("opacity", 1)
				.style("left", (d3.event.pageX) + 0 + "px")
                .style("top", (d3.event.pageY) - 0 + "px");

		})
		.on("mouseout", function(d) {
            hideItemTooltip();
			tooltip.style("opacity", 0);
		});

    // Function that handles clicks on the sunburst so that it can zoom.
    function click(d) {

        // console.log(d);

        showItemTooltip(d);

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

/* Shows details about the item currently selected in the sunburst. */
function showItemTooltip(item) {

    console.log(item);

    $('#tooltipcontent').hide();

    // If it's an actual item proceed to show tooltip
    if (item.slot != undefined) {

        // Only show AR for items where it is not NaN
        // TODO add check for whether item has slots at all
        let agonyPart = isNaN(item.agonyResist) ? "" : '<p class=\"itemagonyresist\">' + item.agonyResist + ' Agony Resist</p>';

        $('#tooltipcontent').html(
            '<p class=\"itemname\">' + item.name + '</p>' +
            '<p class=\"itemrarity\" style=\"color:' + colorDictionary[item.rarity] + ' \">' + item.rarity + '</p>' +
            '<p class=\"itemtype\">' + item.slot + '</p>' +
            agonyPart
        );
        $('#tooltipcontent').show();

    }

}

function hideItemTooltip() {
    $('#tooltipcontent').hide();
}

/* Show data about the character to accompany the sunburst. */
function showCharacterData(characterName) {

    // Determine whether to display vanilla class or elitespec
    var character = account.characterDictionary[characterName];
    var profession = character.profession;

    if(character.eliteSpec != "" && character.eliteSpec != undefined) {
        profession = character.eliteSpec;
    }

    // Select the div and append html.
    $('#sunburstextra').html(
        '<p class=\"charname\">' + characterName + '</p>' +
        '<p class=\"charage"> Level ' + character.level + '</p>' +
        '<p class =\"charprofession\" style=\"color:' + colorDictionary[character.profession] + ' \">' +
        '<img class="profimg" src="Static/Professions/' + professionImageDictionary[profession] + '.png" alt="Achievements">' + profession + '</p>' +
        '<p class =\"charage\"> Played for ' + character.hoursPlayed + ' hours </p>' +
        '<p class =\"charage\">' + character.deaths + ' deaths </p>'
    );
    $('#sunburstextra').show();
}


/* EEN HELE MOOIE FUNCTIE */
function makePieChart(){

    var w = 400;
    var h = 400;
    var r = h/2;
    var aColor = [
        'rgb(178, 55, 56)',
        'rgb(213, 69, 70)',
        'rgb(230, 125, 126)',
        'rgb(239, 183, 182)'
    ]

    var data = account.professionDictionary,
        data2 = account.raceDictionary,
        data3 = account.genderDictionary;

    var vis = d3.select('#actualpiechartpart')
        .append("svg:svg")
        .data([data])
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + r + "," + r + ")");

    var pie = d3.layout.pie().value(function(d){ return d.value; });

    // Declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // Select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
        .data(pie).enter()
        .append("svg:g")
        .attr("class", "slice");
    arcs.append("svg:path")
        .attr("fill", function(d, i){ return colorDictionary[data[i].label]; })
        .attr("d", function (d) { return arc(d); });

    // Add the text
    arcs.append("svg:text")
        .attr("transform", function(d){
            d.innerRadius = 100;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";}
        )
        .attr("text-anchor", "middle")
        .text( function(d, i) { return data[i].value; });
}
