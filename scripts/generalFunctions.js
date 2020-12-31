function getCharacter() {
    if (!window.heroMancer){
        window.heroMancer = {};
        let character = window.heroMancer;
        character.resistances = [];
    }
    return window.heroMancer
}


/*
   Important note: PLEASE INCLUDE "modules/hero-creation-tool/..." to your relative path since we are using foundry as the main file path.
   Returns a promis with the json object as its value.
   Input: path, string
   Return data, promise

   Guide to promises:
   For those who do not know how to access said value from the promise I will right an example code

   let json = getJson("modules/hero-creation-tool/scripts/database/class-jsons/index.json"); //calls the function, json is now a promise
   json //to access the value you can use this quick notation .then (data =>) will assign the value to data where you can use it
   .then(data =>{
      // here data is the Json object for the index.json
      populateList("class-dropdown", data, true, 'class.'); //here I am calling the populateList() passing through data to populate the dropdown list with id="class-dropdown"
   })

   */
async function getJson(path){
   const response = await fetch(path);
   let data;
   return (data = await response.json());
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

function onSelectClassIndex(){
   var path = document.getElementById("class-dropdown").value;
   console.log(path); //class-barbarian.json\
   path = "modules/hero-creation-tool/" + path;
   console.log(`realPath for getJson: ${path}`);
   let classObj = getJson(path);
   classObj
      .then(data =>{
         //parse data and fill html\
         console.log(data);
      });

}
function onSelectRace() {
   //console.log(document.getElementById("race-dropdown").value);
   if (document.getElementById("race-dropdown").value == "Choose your race"){
      return;
   }
   var raceJson = document.getElementById("race-dropdown").value;
   raceJson = JSON.parse(raceJson);
   addRaceData(raceJson);
   document.getElementById("race-speed").innerHTML = raceJson.speed; //makes the html of race-speed be raceJson.speed
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

   raceFeatures = "";
   for (feature of Object.values(raceJson.entries)) {
      raceFeatures += "<h2> " + feature.name + " </h2> ";
      raceFeatures += "<div class='feature-body' > " + feature.entries[0] + " </div>";
   }
   
   document.getElementById("race-features").innerHTML = raceFeatures;
}