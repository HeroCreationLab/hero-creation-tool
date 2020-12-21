function getCharacter() {
    if (!window.heroMancer){
        window.heroMancer = {};
        let character = window.heroMancer;
        character.resistances = [];
    }
    return window.heroMancer
}

/*
Race gives you:
speed,
size,
*/
function addRaceData(json) {
    character = getCharacter();
    character.race = {}
    console.log(json);
    character.race.ability = json.ability;
    character.race.speed = json.speed;
    character.speed = json.speed;
    character.race.name = json.name;
    character.race.entries = json.entries;
    character.race.resistances = json.resistances == undefined ? [] :  json.resistances;
    character.resistances = json.resistances == undefined ? [] :  character.resistances + json.resistances;
    character.size = json.size;

}

function onSelectRace() {
   var raceJson = JSON.parse(document.getElementById("race-dropdown").value);
   addRaceData(raceJson);
   document.getElementById("race-speed").innerHTML = raceJson.speed;
   abilityText = "";
   for (ab of Object.entries(raceJson.ability[0])){
      switch(ab[0]) {
         case "str":
            abilityText += "Strength: " + ab[1] + ", ";
            break;
         case "cha":
            abilityText += "Charisma: " + ab[1]  + ", ";
            break;
         case "wis":
            abilityText += "Wisdom: " + ab[1]  + ", ";
            break;
         case "int":
            abilityText += "Intelligence: " + ab[1] + ", ";
            break;
         case "dex":
            abilityText += "Dexterity: " + ab[1] + ", ";
            break;
         case "con":
            abilityText += "Constititution: " + ab[1] + ", ";
            break;
      }
   }
   document.getElementById("race-ability").innerHTML = abilityText.slice(0,-2);
}