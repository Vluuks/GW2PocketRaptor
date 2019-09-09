
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
            return calculateBestInSlotPercentage(this.character.bestInSlot.distribution);
        }
    },
    methods : {
        triggerSunburst() {
            transformDataForSunburst(this.character.name);
        }
    }
});

