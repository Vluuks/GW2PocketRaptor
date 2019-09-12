
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
            console.log(character);
            var svg = d3.select("#"+character)

            if(!svg) return;

            let percentages = this.character.bestInSlot.percentageArray;
            let colors = ["#8119d1", "#dd1a7f", "#d3d3d3"]
        
            var g = svg.append("g")
                .attr("width", 200)
                .attr("height", 10)
        
            // make progress bar
            var x = d3.scale.linear()
                .range([0, 250])
                .domain([0, 100]);

            var tip = d3.tip()
                .attr('class', 'bartooltip')
                .offset([-2, 0])
                .html(function(d) {
                    return "<span>" + d + "</span>";
                });
                svg.call(tip);

            g.selectAll("rect")
                .data(percentages)
                .enter()
                .append("rect")
                .attr("width", 20)
                .attr("height", 10)
                .style("fill", function(d, i){ 
                    return colors[i];
                })
                .attr("x", function(d, i){
                    return i*20;
                })  

            // let offset = 0;
            // percentages.forEach(function(prct, i){
                
            //     g.append("rect")
            //         .attr("width", prct*2)
            //         .attr("height", 10)
            //         .style("fill", colors[i])
            //         .attr("x", offset)      
                    
            //     offset+=(prct*2)
            // })
        }
    },
    mounted() {
        this.drawGearProgress(this.character.name.split(' ').join('x'));
    },
    beforeUpdate() {
        this.drawGearProgress(this.character.name.split(' ').join('x'));
    }
});

