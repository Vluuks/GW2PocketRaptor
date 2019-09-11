/* 
    Takes the specialization object from the character, going through it and finding the specialization
    ids, based on this we then determine what elite spec is being run from our dictionary. We get PvE spec
    array, take the 3rd entry (this is the slot that holds elite specs) and then determine the id from this. 
*/
function determineEliteSpec(characterSpecs, character){

    // Get PvE spec overview
    if(characterSpecs.pve[2] != undefined){
        var eliteSpecId = characterSpecs.pve[2].id;
        return eliteSpecDictionary[eliteSpecId];
    }
    // No 3rd spec has been set, so it can never be an elite spec
    else {
        return "";
    }
}

/*
    Iterate over equipment and create distribution of item rarities.
*/
function calculateBestInSlot(equipment, character) {

    let pieBase = new PieBase();

    for(item in equipment) {
        pieBase.distribution[equipment[item].rarity]++;
    }

    pieBase.percentage = calculateBestInSlotPercentage(pieBase.distribution);

    return pieBase;
}

/*
    Based on the two top tier rarities (ascended and legendary), calculate
    what the percentage of currently equipped best in slot items on a character is. 
*/
function calculateBestInSlotPercentage(distribution) {

    let bestInSlot = 0;
    let notBestInSlot = 0;

    Object.keys(distribution).forEach(function(rarity) {

        if(rarity == "Ascended" || rarity == "Legendary") {
            bestInSlot += distribution[rarity];
        }
        else {
            notBestInSlot += distribution[rarity];
        }
    })

    // percentage that is best in slot
    return getWholePercent(bestInSlot, (bestInSlot+notBestInSlot));
}

/*
    https://www.quora.com/How-do-I-do-percentages-in-JavaScript
*/
function getWholePercent(percentFor, percentOf) {
    return Math.floor(percentFor/percentOf*100);
}

/* 
    For a given armor piece, calculate the agony infusions present, and based on the ID of these
    infusions return the total amount of agony resist present in the armor piece, trinket or weapon.
    There are many different infusions in this game due to ArenaNet's inconsistent additions and
    revamps of the system, which makes a dictionary necessary to account for all possible types.
    If no infusions are present the infusionsarray will not exist and the function will return 0. 
*/
function calculateAgonyResist(equipment, character) {

    // Instantiate new agonyresist object.
    var agonyResist = new AgonyResist();
    
    // Iterate over all the items.
    for (item in equipment) {
        // If the item has one or multiple infusions.
        if (typeof equipment[item].infusions !== undefined && equipment[item].infusions.length > 0 ) {

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
       
                    // catch unaccounted for (like aurillium)
                    if(infusionDictionary[infusion]) {
                        agonyResist.trinkets += infusionDictionary[infusion];
                    }
                }

                // If it's armor, check for aquabreather and else add to total.
                else if (equipment[item].type == "Armor") {

                    if (equipment[item].slot != "HelmAquatic") {

                        // Validate that infusion exists to avoid NaN
                        if(infusionDictionary[infusion]) {
                            agonyResist.armor += infusionDictionary[infusion];
                        }

                    }
                    // for under water
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

function prepForBarsInefficient() {
    
    var dataArray = [];
    
    for (let character in account.characterDictionary) {
        
        var dataObject = {
            characterName: character,
            agonyResist: account.characterDictionary[character].agonyResist.total
        }

        dataArray.push(dataObject);
    }
    
    return dataArray;
}