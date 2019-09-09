/* Dictionary containing color info. */
var colorDictionary = {

    // Gender
    "Male" : "#7f7f7f",
    "Female" : "#b0b0b0",

    // Races.
    "Asura": "#7a11d3",
    "Norn": "#5575ff",
    "Human": "#ffcc00",
    "Charr" : "#be0000",
    "Sylvari" : "#338000",

    // Rarities.
    "Basic": "#f2f2f2",
    "Fine": "#569fff",
    "Masterwork": "#6dad1f",
    "Rare": "#ffc700",
    "Exotic": "#ff8800",
    "Ascended": "#dd1a7f",
    "Legendary": "#8119d1",

    // Categories.
    "Armor": "#75645b",
    "Weapons": "#4c4441",
    "Aquatic": "#8e817c",
    "Trinkets": "#99837b",

    // Professions.
    "Guardian": "#2a94d6",
    "Dragonhunter": "#2a94d6",
    "Revenant": "#a85555",
    "Herald": "#a85555",
    "Warrior": "#e2ad18",
    "Berserker": "#e2ad18",
    "Engineer": "#915a31",
    "Scrapper": "#915a31",
    "Thief": "#7a6a6d",
    "Daredevil": "#66605b",
    "Ranger": "#99c661",
    "Druid": "#99c661",
    "Elementalist": "#ce3b40",
    "Tempest": "#ce3b40",
    "Mesmer": "#ce3bc9",
    "Chronomancer": "#ce3bc9",
    "Necromancer": "#3a916e",
    "Reaper": "#3a916e",

    // Achievement colors
    "false": "#5b5b5b",
    "true": "#6cc63b"

};

// A dictionary containing key value pairs of item ids and agony resist.
var infusionDictionary = {

    // Stat infusions, legacy infusions, aura infusions.
    "75480": 3,
    "37137": 5,
    "37138": 5,
    "37140": 5,
    "39616": 5,
    "39617": 5,
    "39618": 5,
    "39619": 5,
    "39620": 5,
    "39621": 5,
    "70852": 7,
    "37123": 7,
    "37127": 7,
    "37128": 7,
    "37129": 7,
    "37133": 7,
    "37134": 7,
    "78028": 9,
    "78052": 9,
    "78012": 9,
    "78016": 9,
    "78030": 9,
    "78031": 9,
    "78054": 9,
    "78057": 9,
    "78079": 9,
    "78086": 9,
    "78090": 9,
    "78097": 9,
    "79639": 9,
    "79653": 9,
    "79661": 9,
    "79665": 9,
    "79669": 9,
    "79674": 9,
    "77274": 9,
    "77303": 9,
    "77310": 9,
    "77316": 9,
    "77366": 9,
    "77394": 9,
    "79943": 9,
    "79957": 9,
    "79959": 9,
    "79978": 9,
    "79994": 9,
    "80063": 9,
    "37125": 9,
    "37130": 9,
    "37131": 9,
    "37132": 9,
    "37135": 9,
    "37136": 9,
    "37131": 9,
    "81715": 9,

    // Regular infusions that can be broken down/crafted.
    "49424": 1,
    "49425": 2,
    "49426": 3,
    "49427": 4,
    "49428": 5,
    "49429": 6,
    "49430": 7,
    "49431": 8,
    "49432": 9,
    "49433": 10,
    "49434": 11,
    "49435": 12,
    "49436": 13,
    "49437": 14,
    "49438": 15,
    "49439": 16,
    "49440": 17,
    "49441": 18,
    "49442": 19,
    "49443": 20,

    // Nonsense values map to 0 for safety.
    undefined: 0,
    "undefined": 0,
    NaN: 0
};

var eliteSpecDictionary = {

    // Warrior
    18 : "Berserker",
    61 : "Spellbreaker",

    // Guardian
    27 : "Dragonhunter",
    62 : "Firebrand",

    // Revenant
    52 : "Herald",
    63 : "Renegade",

    // Engineer
    43 : "Scrapper",
    57 : "Holosmith",

    // Thief
    7 :  "Daredevil",
    58 : "Deadeye",

    // Ranger
    5 : "Druid",
    55 : "Soulbeast",

    // Elementalist
    48: "Tempest",
    56: "Weaver",

    // Necromancer
    34 : "Reaper",
    60 : "Scourge",

    // Mesmer
    40 : "Chronomancer",
    59 : "Mirage"
}


var professionImageDictionary = {

    "Guardian" : "guard-big",
    "Dragonhunter": "dh-big",
    "Firebrand" : "firebrand-big",

    "Warrior" : "war-big",
    "Berserker" : "berserker-big",
    "Spellbreaker" : "spellbreaker-big",

    "Revenant" : "rev-big",
    "Herald" : "herald-big",
    "Renegade" : "renegade-big",

    "Ranger" : "ranger-big",
    "Druid" : "druid-big",
    "Soulbeast" : "soulbeast-big",

    "Engineer" : "engi-big",
    "Scrapper" : "scrapper-big",
    "Holosmith" : "holosmith-big",

    "Thief" : "thief-big",
    "Daredevil" : "dd-big",
    "Deadeye" : "deadeye-big",

    "Elementalist" : "ele-big",
    "Tempest" : "tempest-big",
    "Weaver" : "weaver-big",

    "Mesmer" : "mes-big",
    "Chronomancer" : "chrono-big",
    "Mirage" : "mirage-big",

    "Necromancer" : "necro-big",
    "Reaper" : "reaper-big",
    "Scourge" : "scourge-big"
}

var indexDictionary = {

    "Guardian" : 0,
    "Warrior" : 1,
    "Revenant" : 2,
    "Ranger" : 3,
    "Engineer" : 4,
    "Thief" : 5,
    "Elementalist" : 6,
    "Mesmer" : 7,
    "Necromancer" : 8,

    "Asura" : 0,
    "Charr" : 1,
    "Human" : 2,
    "Norn" : 3,
    "Sylvari" : 4,

    "Male" : 0,
    "Female" : 1
};
