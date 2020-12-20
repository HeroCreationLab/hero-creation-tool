
const fs = require('fs');

let user = JSON.parse(fs.readFileSync('races.json'));
let srdOptionalFeats = [];

for (let i in user.optionalfeature) {
    if (user.optionalfeature[i].srd == true) {
        srdOptionalFeats.push(user.optionalfeature[i]);
    } 
}

console.log(srdOptionalFeats);

module.exports.srdOptionalFeats = srdOptionalFeats;