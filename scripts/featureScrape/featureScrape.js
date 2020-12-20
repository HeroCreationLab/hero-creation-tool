
const fs = require('fs');

let user = JSON.parse(fs.readFileSync('./feats.json'));
let srdFeats = [];

for (let i in user.feat) {
    if (user.feat[i].srd == true) {
        srdFeats.push(user.feat[i]);
    } 
}

console.log(srdFeats);
module.exports.srdFeats = srdFeats;