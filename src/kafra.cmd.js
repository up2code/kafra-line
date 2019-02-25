const lineMessage = require('./line.message');
const fs = require('fs');
const cmdList = require('./commands.json');
const botMessage = require('./message.default');
const format = require('string-format');

const readReferenceFileContent = (fileName, callback) => fs.readFile('./ref/' + fileName, 'utf8', callback);

const compare = (a,b) => {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
}

const generateHelp = () => {
    let content = 'ทุกคำสั่งกรุณาใส่เครื่องหมาย ! นำหน้าด้วยนะคะ (เช่น !taming)\n';

    content += cmdList
        .sort(compare)
        .map(c => (c.name + ': ' + c.description + '\n')).join('');

    return content;
}

module.exports = {
    run: (cmd, callback) => {
        
        if(cmd == 'help') {
            return callback(lineMessage.createTextMessage(generateHelp()));
        }

        const action = cmdList.find(c => c.name == cmd.toLowerCase());

        if(!action) {
            return callback(lineMessage.createTextMessage(format(botMessage.command_not_found, cmd)));
        }
        
        if(action.type == 'image') {
            return callback(lineMessage.createImageMessage(action.value, action.value));
        }

        if(action.type == 'url') {

            let replyMsg = (action.description) ? action.description + '\n' + action.value : action.value;

            return callback(lineMessage.createTextMessage(replyMsg));
        }

        if(action.type == 'file') {

            readReferenceFileContent(action.value, (err, content) => {

                if(!err) {
                    callback(lineMessage.createTextMessage(content))
                } else {
                    console.log(err)
                }
                
            });
        }
    }
}