import { Utils } from './utils.js'

function getCharacter() {
   if (!window.heroMancer) {
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
   console.log(`${Constants.LOG_PREFIX} | ${json}`);
   character.race.ability = json.ability;
   character.race.speed = json.speed;
   character.speed = json.speed;
   character.race.name = json.name;
   character.race.entries = json.entries;
   character.race.resistances = json.resistances == undefined ? [] : json.resistances;
   character.resistances = json.resistances == undefined ? [] : character.resistances + json.resistances;
   character.size = json.size;
}

function onSelectClassIndex() {
   var path = document.getElementById("class-dropdown").value;
   console.log(`${Constants.LOG_PREFIX} | ${path}`); //class-barbarian.json\
   path = "modules/hero-creation-tool/" + path;
   console.log(`${Constants.LOG_PREFIX} | realPath for getJson: ${path}`);
   // let classObj = getJson(path);
   // classObj
   //    .then(data => {
   //       //parse data and fill html\
   //       console.log(`${Constants.LOG_PREFIX} | ${data);
   //    });

}
function onSelectRace() {
   //console.log(`${Constants.LOG_PREFIX} | ${document.getElementById("race-dropdown").value);
   if (document.getElementById("race-dropdown").value == "Choose your race") {
      return;
   }
   var raceJson = document.getElementById("race-dropdown").value;
   // raceJson = JSON.parse(raceJson);
   // addRaceData(raceJson);
   document.getElementById("race-speed").innerHTML = raceJson.speed; //makes the html of race-speed be raceJson.speed
   abilityText = "";
   for (ab of Object.entries(raceJson.ability[0])) {
      switch (ab[0]) {
         case "str":
            abilityText += "Strength: " + ab[1] + ", ";
            break;
         case "cha":
            abilityText += "Charisma: " + ab[1] + ", ";
            break;
         case "wis":
            abilityText += "Wisdom: " + ab[1] + ", ";
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
   document.getElementById("race-ability").innerHTML = abilityText.slice(0, -2);

   raceFeatures = "";
   for (feature of Object.values(raceJson.entries)) {
      raceFeatures += "<h2> " + feature.name + " </h2> ";
      raceFeatures += "<div class='feature-body' > " + feature.entries[0] + " </div>";
   }

   document.getElementById("race-features").innerHTML = raceFeatures;
}
