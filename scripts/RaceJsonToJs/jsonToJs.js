
//inporting File Syst and HTTP Module
const fs = require('fs');
const http = require('http');

let user = JSON.parse(fs.readFileSync('races.json'));
let srdRace = [];
userRace = user.race;
let raceCount = 0;

for (let i in userRace) {
    if (userRace[i].srd) {
        srdRace.push(userRace[i]);
        srdRace[raceCount].subraces = [];
        console.log(userRace[i]);
        if (userRace[i].subraces){
            for (let x in userRace[i].subraces){
                console.log(userRace[i].subraces[x]);
                if (userRace[i].subraces[x].srd){
                    console.log("Has srd.");
                    srdRace[raceCount].subraces.push(userRace[i].subraces[x]);
                }
            }
        }
        raceCount ++; 
    } 
}



//console.log(SrdRace);
//how to focus on the JSon race section
//console.log(user);

/*
var name = user.race[0].name; //getting the races name
var size =  user.race[0].size;
var ability = user.race[0].ability[0];

var raceFeatures = user.race[0].entries;
var subRace = user.race[0].subraces;

var subRaceSpeed = subRace[0].speed;
var darkVision = subRace[0].darkvision;
var str = 0;
var con = 0;
var int = 0;
var dex = 0;
var wiz = 0;
var char = 0;

console.log(subRaceSpeed);
console.log(darkVision);

// Adding ability score increases for base race
str += ability.str == undefined ? 0 : ability.str;
con += ability.con == undefined ? 0 : ability.con;
dex += ability.dex == undefined ? 0 : ability.dex;
int += ability.int == undefined ? 0 : ability.int;
char += ability.char == undefined ? 0 : ability.char;
wiz += ability.wiz == undefined ? 0 : ability.wiz;

console.log(subRace);
*/

