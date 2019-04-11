const lineMessage = require('./line.message');
const botMessage = require('./message.default');
const format = require('string-format');
const firebase = require('./firebase');
const Chance = require('chance')
const chance = new Chance();

const compare = (a,b) => {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
}

const generateHelp = cmdList => {
    let content = 'ทุกคำสั่งกรุณาใส่เครื่องหมาย ! นำหน้าด้วยนะคะ (เช่น !taming)\n';

    content += cmdList
        .sort(compare)
        .map(c => (c.name + ': ' + c.description + '\n')).join('');

    return content;
}

module.exports = {
    run: cmd => {
        
        if(cmd == 'help') {
            return firebase.getAllCommand().then(cmdList => lineMessage.createTextMessage(generateHelp(cmdList)));
        }

        return firebase.getCommand(cmd.toLowerCase())
        .then(action => {

            if(!action) {
                return lineMessage.createTextMessage(format(chance.pickone(botMessage.command_not_found), cmd));
            }
            
            if(action.type == 'image') {
                return lineMessage.createImageMessage(action.value, action.value);
            }

            if(action.type == 'image_list') {
                return lineMessage.createMultipleImagesMessage(action.value);
            }

            if(action.type == 'url') {

                let replyMsg = (action.description) ? action.description + '\n' + action.value : action.value;

                return lineMessage.createTextMessage(replyMsg);
            }
        });

        
    }
}