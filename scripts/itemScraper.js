const fs = require('fs');

let parser = JSON.parse(fs.readFileSync('items-base.json'));
let parserMagic = JSON.parse(fs.readFileSync('items.json'));
let srdItems = [];

for (let i in parser.baseitem) {
    if (parser.baseitem[i].srd == true) {
        srdItems.push(parser.baseitem[i]);
    } 
}
for (let i in parserMagic.item)
{
    if (parserMagic.item[i].srd == true)
    {
        srdItems.push(parserMagic.item[i]);
    }
}

fs.writeFileSync("./database/item-jsons/srdItems.json", JSON.stringify(srdItems));
    