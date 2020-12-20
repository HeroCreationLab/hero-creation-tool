
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require('constants');
const fs = require('fs');

/*
Author: Alexander Sedore
Date: 12/19/2020
Version: 0.2
Opens json file and parses it returning a json object we can manipulate.
*/

function import_Json(filePath){
    let obj = JSON.parse(fs.readFileSync(filePath));
    return obj;
}

//import and modify index/database (for later)


module.exports.import_Json = import_Json;

