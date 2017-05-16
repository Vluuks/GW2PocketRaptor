/* Contains the "model classes" for the data visualisation. 
   We need multiple instances of these objects so they come in constructor shape. */

function Character() {
    this.name = "";
    this.race = "";
    this.agonyResist = 0;
    this.profession = "";
    this.level = -1;
    this.equipment = [];
    this.equipmentRarity = [];
    this.sunburstDataCache = undefined;
}

function AgonyResist() {
    this.total = 0;
    this.trinkets = 0;
    this.armor = 0;
    this.weaponsA = 0;
    this.weaponsB = 0;
    this.aquatic = 0;
}

function Item(id, name, rarity, infusions, type, slot, weaponSlot) {
    this.id = id;
    this.name = name;
    this.rarity = rarity;
    this.infusions = infusions;
    this.type = type;
    this.slot = slot;
    this.weaponSlot = weaponSlot;
    this.agonyResist = 0;
    this.size = 1;
}

function SunburstBase(){
    
    this.name = "Equipment";
    this.children = [

        {
            "name": "Armor",
            "children": []
        },
        {
            "name": "Trinkets",
            "children": []
        },
        {
            "name": "Weapons",
            "children": []
        },
        {
            "name": "Aquatic",
            "children": []
        },
    ];   
}

// Global account Variable.
var account = {
    name: "",
    apiKey: "",
    hoursPlayed: -1,
    characters: [],
    characterAmount: -1,
    fractalLevel: -1,
    fractalRelics: -1,
    fractalPristine: -1,
    characterDictionary: {}
}