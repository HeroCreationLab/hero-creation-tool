
/*
Author: Alexander Sedore
Date: 12/19/2020
Version: 0.3
Opens json file and parses it returning a json object we can manipulatec based on typeJson given.
spell for spell json, ect
Input: filePath: string, typeJson: string
Output: object [{}]
*/

function importJson(filePath, typeJson){
    let obj = JSON.parse(fs.readFileSync(filePath));
    if (typeJson == "spell"){
        let spell = obj.spell;
        return spell;
    } else if (typeJson == "race"){
        let race = obj.race;
        return race;
    }else if (typeJson == "language"){
        let language = obj.language;
        return language;
    }else if (typeJson == "item"){
        let item = obj.item;
        return item;
    }else if (typeJson == "feat"){
        let feat = obj.feat;
        return feat;
    }else if (typeJson == "background"){
        let background = obj.background;
        return background;
    } else {
        return obj;
    }
}

/*
Author: Alexander Sedore
Date: 12/19/2020
Version: 0.1
Takes a Json object, the type of Json it is and the file name and saves it into the database and returns the filepath to the newly created json.
Input: obj:[{}], typeJson: string, fileName: string
Output: filePath: string
*/
function saveJson(object, typeJson, fileName){
    let filePath = '../database';
    if (typeJson == "spell"){
        filePath = filePath + '/spell-jsons/' + fileName;
    } else if (typeJson == "race"){
        filePath = filePath + '/race-jsons/' + fileName;
    }else if (typeJson == "language"){
        filePath = filePath + '/language-jsons/' + fileName;
    }else if (typeJson == "item"){
        filePath = filePath + '/item-jsons/' + fileName;
    }else if (typeJson == "feat"){
        filePath = filePath + '/feat-jsons/' + fileName;
    }else if (typeJson == "background"){
        filePath = filePath + '/background-jsons/' + fileName;
    } else {
        filePath = filePath + '/class-jsons/' + fileName;
    }
    fs.writeFileSync(filePath, JSON.stringify(object));
    return filePath;
}
/*
Populate a selcelct dropdownlist based on id and filepath for a index json.
Input : ID: string, filePath: string, typeJson: string
Output: N/A
*/
function populateList(id, filePath, typeJson){
   
    const fs = require('fs');
    // console.log(typeJson);
    // console.log(id);
    // console.log(filePath);
     //initialize drop down list and add default value
    let dropdown = document.getElementById(id);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose your class';

    dropdown.add(defaultOption);
    dropdown.selectIndex = 0;
    //check if the file is a index or not
    //console.log(typeJson);
    let index = JSON.parse(fs.readFileSync(filePath));
    console.log(index);
    let option;
    for (k in index){
        option = document.createElement('option');
        option.text = k;
        option.value = index[k];
        dropdown.add(option);
    }
    if (typeJson == "index"){
        /*//if it is then populate it using the first element of the object array
        "/database/class-jsons/index.json" = filepath
        class-dropdown = "id"
        typeJson: "index"
        index
        [{"barbarian": "class-barbarian.json", 
            "bard": "class-bard.json",
            "cleric": "class-cleric.json",
            "druid": "class-druid.json",
            "fighter": "class-fighter.json",
            "monk": "class-monk.json",
            "paladin": "class-paladin.json",
            "ranger": "class-ranger.json",
            "rogue": "class-rogue.json",
            "sorcerer": "class-sorcerer.json",
            "warlock": "class-warlock.json",
            "wizard": "class-wizard.json"
        }]*/
        
    } else {

    }
}