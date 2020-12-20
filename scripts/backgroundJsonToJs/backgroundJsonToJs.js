
const fs = require('fs');

let user = JSON.parse(fs.readFileSync('backgrounds.json'));
let srdBackgrounds = [];
let background = user.background;
for (let i in background) {
    if (background[i].srd == true) {
        srdBackgrounds.push(background[i]);
    } 
}
//fs.writeFileSync('date.json', JSON.stringify(today));
fs.writeFileSync('../../database/background-jsons/srdBackgrounds.json', JSON.stringify(srdBackgrounds));
//console.log(srdBackgrounds);

//module.exports.srdBackgrounds = srdBackgrounds;