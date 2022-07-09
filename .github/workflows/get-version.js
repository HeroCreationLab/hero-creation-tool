let fs = require('fs')
console.info(JSON.parse(fs.readFileSync('./dist/module.json', 'utf8')).version)