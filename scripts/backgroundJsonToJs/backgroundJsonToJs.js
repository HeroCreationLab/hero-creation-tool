
const fs = require('fs');

let user = JSON.parse(fs.readFileSync('backgrounds.json'));
let srdBackgrounds = [];
let background = user.background;
for (let i in background) {
    if (background[i].srd == true) {
        srdBackgrounds.push(background[i]);
    } 
}

console.log(srdBackgrounds);

//module.exports.srdBackgrounds = srdBackgrounds;