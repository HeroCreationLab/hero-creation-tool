const fs = require('fs');


function cleanSRDClasses(path) {
let json = JSON.parse(fs.readFileSync(path));
let srdClass;
let srdClassFeature;
let srdSubclassFeature;

for (let classElement of json.class) {
    if (classElement.srd) {
        srdClass = classElement;
        if (classElement.subclasses) {
            for (let subclass = 0; subclass < classElement.subclasses.length; subclass++) {
                if (!classElement.subclasses[subclass].srd) {
                    srdClass.subclasses.splice(subclass, 1);
                    subclass--;
                }
            }
        }
    }
}
let classFeature = json.classFeature;
srdClassFeature = classFeature;
for (let i = 0; i < classFeature.length; i++) {
    if (!classFeature[i].srd) {
        srdClassFeature.splice(i, 1);
        i--;
    }
}
let subclassFeature = json.subclassFeature
srdSubclassFeature = subclassFeature;
for (let i = 0; i < subclassFeature.length; i++) {
    if (!subclassFeature[i].srd) {
        srdSubclassFeature.splice(i, 1);
        i--;
    }
}
writePath = "../database/class-jsons/" + path;
let combined = {"class": srdClass, "classFeature": srdClassFeature, "subclassFeature": srdSubclassFeature};
fs.writeFileSync(writePath, JSON.stringify(combined));
}

let classes = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorcerer", "warlock", "wizard"];

for (let c of classes) {
    console.log(`Cleaned ${c}`)
    cleanSRDClasses(`class-${c}.json`);
}

// fs.writeFileSync('../../database/background-jsons/srdBackgrounds.json', JSON.stringify(srdBackgrounds));

// module.exports.srdRace = srdClass;

// lst = ["class", "classFeature", "subclassFeature"]
// function cleanSRDRecursive(json, isWrite = true) {
//     for (let obj in json) {
//         if (typeof json[obj] == "object" && json[obj]) {
//             cleanSRDRecursive(json[obj]);
//             if (!json[obj].has("srd")) {
//                 cleanSRDRecursive(json[obj], 1);
//             } else {
//                 cleanSRDRecursive(json[obj], 0);
//             }
//         }
//     }
//     if (isWrite) {
//         fs.writeFileSync('test.json', JSON.stringify(json));
//     }
// }
// let json = JSON.parse(fs.readFileSync('./database/class-jsons/class-barbarian.json'));
// cleanSRDRecursive(json);