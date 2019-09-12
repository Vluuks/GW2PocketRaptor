
Vue.component('character', {
    props: {
        character: {
            type: Object,
            required: true
        }
    },
    name: "character",
    template: '#character-template',
    computed: {
        professionColor() {
            return colorDictionary[this.character.profession];
        },
        professionName() {
            if(this.character.eliteSpec != "" && this.character.eliteSpec != undefined) {
                return this.character.eliteSpec;
            }
            return this.character.profession;
        },
        professionImage() {
            if(this.character.eliteSpec != "" && this.character.eliteSpec != undefined) {
                return 'Static/Professions/' + professionImageDictionary[this.character.eliteSpec] + '.png';
            }
            return 'Static/Professions/' + professionImageDictionary[this.character.profession] + '.png';
        },
        bestInSlot() {
            return this.character.bestInSlot.percentage + "%";
        }
    },
    methods : {
        triggerSunburst() {
            transformDataForSunburst(this.character.name);
        },
        drawGearProgress(character) {
            
            var svg = d3.select("#"+character)

            

            if(!svg) return;

            let percentages = this.character.bestInSlot.percentageArray;
            console.log(character + percentages.toString());
            let colors = ["#8119d1", "#dd1a7f", "#d3d3d3"];
            let type = ["Legendary", "Ascended", "Exotic or lower"]

            console.log(character);
            console.log( percentages[0] + percentages[1] + percentages[2]);
        
            var g = svg.append("g")
                .attr("width", 200)
                .attr("height", 10)
        
            // make progress bar
            var x = d3.scale.linear()
                .range([0, 200]).nice()
                .domain([0, 100]).nice();

            var tip = d3.tip()
                .attr('class', 'progress-tooltip')
                .offset([-2, 0])
                .html(function(d, i) {
                    return "<span>" + d + "% is " + type[i] + "</span>";
                });
                d3.select("#"+character).call(tip);

            g.selectAll("rect")
                .data(percentages)
                .enter()
                .append("rect")
                .attr("width", function(d) {
                    return x(d); })
                .attr("height", 10)
                .style("fill", function(d, i) { 
                    return colors[i];
                })
                .attr("x", function(d, i) {
                    return i > 0 ? x(percentages[i-1] + ( i > 1 ? percentages[i-2] : 0)) : 0;
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);  
  
        }
    },
    mounted() {
        this.drawGearProgress(this.character.name.split(' ').join('x'));
    },
    beforeUpdate() {
        this.drawGearProgress(this.character.name.split(' ').join('x'));
    }
});

