window.onload = function() {

    console.log("sflasfaf");
    var svg = d3.select("#progressbar")
    let percentages = [15, 60, 25];
    let colors = ["#8119d1", "#dd1a7f", "#d3d3d3"]

    var g =svg.append("g")
        .attr("width", 250)
        .attr("height", 20)

    let offset = 0;
    percentages.forEach(function(prct, i){
        
        g.append("rect")
            .attr("width", prct*2)
            .attr("height", 20)
            .style("fill", colors[i])
            .attr("x", offset)      
            
        offset+=(prct*2)
    })


}

function drawGearProgress(percentage, character) {
    var svg = d3.select("#progressbar")
    let percentages = [15, 60, 25];
    let colors = ["#8119d1", "#dd1a7f", "#d3d3d3"]

    var g = svg.append("g")
        .attr("width", 250)
        .attr("height", 20)

    let offset = 0;
    percentages.forEach(function(prct, i){
        
        g.append("rect")
            .attr("width", prct*2)
            .attr("height", 20)
            .style("fill", colors[i])
            .attr("x", offset)      
            
        offset+=(prct*2)
    })
}