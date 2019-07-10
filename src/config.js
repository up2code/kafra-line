const fs = require('fs');

module.exports = () => {
  return JSON.parse(fs.readFileSync(`${__dirname}/../global_config.json`));
};