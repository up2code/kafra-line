const poporing = require('./poporing');
const itemListTemplate = require('../flex_templates/itemList');
const kafraCmd = require('./kafra.cmd');
const botMessage = require('./message.default');
const format = require('string-format');
const lineMessage = require('./line.message');

const cmdTypeConst = {
    command: 'cmd',
    poporing: 'poporing'
}

const getMessageCmdType = text => {
    if(text.startsWith('!')) return cmdTypeConst.command;
    if(text.startsWith('$')) return cmdTypeConst.poporing;
    return;
}

module.exports = (text, callback) => {

    if(!text) return callback(botMessage.command_not_found);

    const cmdType = getMessageCmdType(text);

    const remainText = text.substr(1);

    switch(cmdType) {
        case cmdTypeConst.command: 
            return kafraCmd.run(remainText, replyMessage => callback(replyMessage));
        case cmdTypeConst.poporing:
            poporing.getLatestPrices(remainText, priceList => {
                if(priceList && priceList.length) {
                    return callback(itemListTemplate(priceList));
                } else {
                    return callback(lineMessage.createTextMessage(format(botMessage.item_not_found, remainText)));
                }
            });
            break;
    }
}
