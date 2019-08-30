/* redraw when new data is present
 every character iteration?
 or maybe in batches  */
var firstTime = true;
var config = {};

window.onload = function(){ 
// Set the dimensions of the canvas.
    config.margin = {
        top: 20,
        right: 50,
        bottom: 20,
        left: 50
    },
    config.width = 980 - config.margin.left - config.margin.right,
    config.height = 400 - config.margin.top - config.margin.bottom;

}

/* Update with transition and withour remaking the canvas. */
 function updateBarChartWithTransition() {

    // Get the new data for the character
    var data = prepForBarsInefficient();

    // If it's the first time, initialize. 
    if(firstTime) {

        console.log("hoi_barchart");
        makePieChart();

        d3.select("#barchartpart").append("svg")
        .attr("id", "barchartsvg")
        .attr("width", config.width + config.margin.left + config.margin.right)
        .attr("height", config.height + config.margin.top + config.margin.bottom)
        .append("g")
        .attr("id", "bar-svg-g")
        .attr("transform",
            "translate(" + config.margin.left + "," + config.margin.top + ")");
        
        firstTime = false;
        // Hide and show dom elements.
        $('#barchartloading').hide();
        $('#sunburstwait').show();
        
        // Set the domain and range.
        config.x = d3.scale.ordinal()
        .rangeRoundBands([0, config.width], .05)
        .domain(data.map(function(d) {
            return d.characterName;
        }));
        
        config.y = d3.scale.linear()
        .range([config.height, 0])
        .domain([0, 150]);
        
        // Define the axes.
        config.xAxis = d3.svg.axis()
        .scale(config.x)
        .orient("bottom")
        
        config.yAxis = d3.svg.axis()
        .scale(config.y)
        .orient("left")
        .ticks(15);
    
        // Add tooltip.
        config.tip = d3.tip()
        .attr('class', 'bartooltip')
        .offset([-2, 0])
        .html(function(d) {
            return "<span>" + d.agonyResist + "</span>";
        });
        d3.select("#barchartsvg").call(config.tip);

        // Add Y axis.
        d3.select("#bar-svg-g").append("g")
            .attr("class", "y axis")
            .call(config.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -43)
            .attr("dy", ".71em")
            .attr("fill", "#666666")
            .text("total Agony Resistance");
    }

    // Select all the current bars.
    var svgUpdate = d3.select("#bar-svg-g");
    var selection = svgUpdate.selectAll("bar")
        .data(data);
    
    // Enter.
    selection.enter()
        .append("rect")
        .style("fill", "#d3d3d3");
    
    // Exit.
    selection.exit()
        
        .transition()
        .delay(100)
        .duration(200)
        .style("fill", function(d){
            return colorDictionary[account.characterDictionary[d.characterName].profession];
        })
        .style("opacity", 0)
        .remove();

    // Update
    selection.transition()
        .duration(500)
        .ease("bounce")
        .attr("class", "bar")
        .attr("x", function(d) {
            return config.x(d.characterName);
        })
        .attr("width", config.x.rangeBand())
        .attr("y", function(d) {
            return config.y(d.agonyResist ? d.agonyResist : 0 );
        })
        .attr("height", function(d) {
            return config.height - config.y(d.agonyResist ? d.agonyResist : 0 );
        })
        .style("fill", function(d) {
            return colorDictionary[account.characterDictionary[d.characterName].profession];
        })

    selection
        .on('mouseover', config.tip.show)
        .on('mouseout', config.tip.hide)
        .on("click", function(d) {
            transformDataForSunburst(d.characterName);
            console.log(d);
        });

    // Add X axis, done after bar chart so text is over it instead of under it.
    if ($("#bar-xaxis")) {
        $("#bar-xaxis").remove();
    }

    svgUpdate.append("g")
        .attr("id", "bar-xaxis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + config.height + ")")
        .call(config.xAxis)
        .selectAll("text")
        .style("font-size", "10px")
        .style("text-anchor", "start")
        .attr("dx", "1em")
        .attr("dy", "-.56em")
        .attr("transform", "rotate(-90)")
        .on("click", function(d) {
            transformDataForSunburst(d);
        });
}
