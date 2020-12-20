
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
Input : ID: string, object: Json Array, typeJson: string
Output: N/A
*/
function populateList(id, object, typeJson){
     //initialize drop down list and add default value
    let dropdown = document.getElementById(id);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose your class';

    dropdown.add(defaultOption);
    dropdown.selectIndex = 0;
    //check if the file is a index or not
    //console.log(typeJson);
    /*
    class{}, subclass[{}], classfeature{}, subclassfeature{}, races[{}], subraces[{}], backgrounds[{}], features[{}], optionalfeatures[{}], index {}, items [{}], spell
    done: race, index, subrace
    */
   let option;
    if (typeJson == "index"){
        for (a in object){
            option = document.createElement('option');
            option.text = a;
            option.value = index[a];
            dropdown.add(option);
        }
    } else if (typeJson == "race"){
        for (race in object){
            option = document.createElement('option');
            option.text = race.name;
            option.value = race;
            dropdown.add(option); 
        }

    } else if (typeJson == "subrace"){
        for (subRace in object){
            option = document.createElement('option');
            option.text = subRace.name;
            option.vaule = subRace;
            dropdown.add(option);

        }
    }
}

/*
Populate a spell selelect dropdownlist based on id, spell caster, the level of the caster and a given spell list.
Input : ID: string, spellClass: int, level: int, spellList: jsonObject
*/
function populateSpellList(id, spellClass, level, spellList){

}

/*
Populate a item selcelct dropdownlist based on id the type of item.
Input : ID: string, itemType: char
Output: N/A
*/
function populateItemList(id, itemType){

}