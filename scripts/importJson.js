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
Author: Alexander Sedore
Date: 12/20/2020
Version: 0.2
Populate a selcelct dropdownlist based on id and filepath for a index json.
Input : ID: string, object: Json Array, isIndex: boolean, defaaultName: string
Output: N/A
*/
function populateList(id, object, isIndex, defaultName){
     //initialize drop down list and add default value
    let dropdown = document.getElementById(id);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = `Choose your ${defaultName}`;

    dropdown.add(defaultOption);
    dropdown.selectIndex = 0;

    let option;
    if (isIndex){
        for (a in object){
            option = document.createElement('option');
            option.text = a;
            option.value = a;
            dropdown.add(option);
        }
    } else{
        for (let obj of object){
            option = document.createElement('option');
            option.text = obj.name;
            option.value = JSON.stringify(obj);
            dropdown.add(option);
        }
    }

    option = document.createElement('option');
    option.text = 'Custom';
    option.value = 'Custom';
    dropdown.add(option);
}

/*
Populate a spell selelect dropdownlist based on id, spell caster, the level of the caster and a given spell list.
Input : ID: string, spellClass: int, spellSubClass: string, level: int, spellList: jsonObject
*/
function populateSpellList(id, spellClassName, spellSubClassName, level, background, race, spellList){
    let dropdown = document.getElementById(id);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose your spell';

    dropdown.add(defaultOption);
    dropdown.selectIndex = 0;

    let option;

    for (let spell of spellList){
        if (level == spell.level){
            if(isUsable(spellClassName, spellSubClassName, background, race, spell)){
                option = document.createElement('option');
                option.text = spell.name;
                option.value = JSON.stringify(spell);
                dropdown.add(option);
            }
        }
    }
}
/* 
returns wether the class is capable of casting a spell based on class requirements/subclass requirements
Input: spellClassName: string, spellSubClassName: string, background: string, race: race, spellClassList: object
Output: boolean
*/
function isUsable(spellClassName, spellSubClassName, background, race, spell){
    //check the class list for the class name
    
    let classList = spell.classes.fromClassList;
    if(classList){
        for (let spellClass of classList){
            if (spellClass.name == spellClassName){
                return true;
            }
        }
    }
    //check the subclass list if available.
    let subClassList = spell.classes.fromSubClass;
    if (subClassList){
        for (let subSpellClass of subClassList){
            if (subSpellClass.class.name == spellClassName && subSpellClass.subclass.name == spellSubClassName){
                return true;
            }
        }
    }

    //check race list if available
    let raceList = spell.races;
    if (raceList){
        for (race of raceList){
            if (race == race.name){
                return true;
            }
        }
    }

    //check backgrounds if available
    let backgrounds = spell.backgrounds;
    if(backgrounds){
        for (back of backgrounds){
            if (background == back.name){
                return true;
            }
        }
    }
    return false;
}

function populateItemList(id, items, typeItem, itemName){

}
/* Testing
let spellList = JSON.parse(fs.readFileSync("./spells-phb.json"));
fs.writeFileSync("./output.json", JSON.stringify(populateSpellList("here", "Cleric", "Life", 0, "Half-Orc", "Acolyte", spellList)));*/
