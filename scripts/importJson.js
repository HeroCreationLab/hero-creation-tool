
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require('constants');
const fs = require('fs');

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

module.exports.importJson = importJson;
module.exports.saveJson = saveJson;