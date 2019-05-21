const lineMessage = require('./line.message');
const botMessage = require('./message.default');
const format = require('string-format');
const firebase = require('./firebase');
const Chance = require('chance')
const chance = new Chance();
const fs = require('fs');

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

const validateAndRunAction = action => {

    if(!action.type || action.type == 'text') {
        return lineMessage.createTextMessage(action.value);
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

    if(action.type == 'file') {
        
        let filePath = './ref/' + action.value;

        if(!fs.existsSync(filePath)) {
            return firebase.downloadFile(action.value)
            .then(() => {
                    return new Promise(resolve => {

                        fs.readFile('./ref/' + action.value, 'utf8', (err, content) => {
                            if(err) {
                                console.error(err);
                            } else {
                                resolve(lineMessage.createTextMessage(content));
                            }
                        });

                    });
            });
        } else {
            return new Promise(resolve => {

                fs.readFile('./ref/' + action.value, 'utf8', (err, content) => {
                    if(err) {
                        console.error(err);
                    } else {
                        resolve(lineMessage.createTextMessage(content));
                    }
                });

            });
        }
    }
}

module.exports = {
    run: cmd => {
        if(cmd == 'help') {
            return firebase.getAllCommand().then(cmdList => lineMessage.createTextMessage(generateHelp(cmdList)));
        }

        return firebase.getAllCommand().then(cmdList => {
            var action = cmdList.find(act => act.name === cmd || (act.alias && act.alias.indexOf(cmd) != -1));

            if(!action) {
                return lineMessage.createTextMessage(format(chance.pickone(botMessage.command_not_found), cmd));
            }

            return validateAndRunAction(action);
        });
    }
}