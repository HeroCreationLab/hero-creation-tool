const fs = require('fs');

let user = JSON.parse(fs.readFileSync('optionalfeatures.json'));
let srdOptionalFeats = [];

for (let i in user.optionalfeature) {
    if (user.optionalfeature[i].srd == true) {
        srdOptionalFeats.push(user.optionalfeature[i]);
    } 
}

fs.writeFileSync('../../database/feat-jsons/srdOptionalFeats.json', JSON.stringify(srdOptionalFeats));
//console.log(srdOptionalFeats);

//module.exports.srdOptionalFeats = srdOptionalFeats;