const fs = require('fs');

var config = JSON.parse(fs.readFileSync(`${__dirname}/../global_config.json`));

module.exports = config;