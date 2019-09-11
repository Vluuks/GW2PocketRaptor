
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
        drawGearProgress( character) {
            var svg = d3.select("#"+character)
            console.log(svg);
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
    }
});

