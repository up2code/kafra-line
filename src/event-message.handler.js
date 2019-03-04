const poporing = require('./poporing');
const romexchange = require('./romexchange');
const itemListTemplate = require('../flex_templates/itemList');
const itemListRomExTemplate = require('../flex_templates/itemList.romexchange');
const kafraCmd = require('./kafra.cmd');
const botMessage = require('./message.default');
const format = require('string-format');
const lineMessage = require('./line.message');
const chat = require('./chat');
const gacha = require('./gacha');

const cmdTypeConst = {
    command: 'cmd',
    poporing: 'poporing',
    romexchange: 'romexchange',
    chat: 'chat',
    gacha: 'gacha'
}

const getMessageCmdType = text => {
    if(text.startsWith('!')) return cmdTypeConst.command;
    if(text.startsWith('$$')) return cmdTypeConst.romexchange;
    if(text.startsWith('$')) return cmdTypeConst.poporing;
    if(text.startsWith('ไขกาชา')) return cmdTypeConst.gacha;
    return cmdTypeConst.chat;
}


module.exports = (text, callback) => {

    if(!text) return callback(botMessage.command_not_found);

    const cmdType = getMessageCmdType(text);

    const remainText = text.substr(1);

    const priceListResponse = priceList => {
        if(priceList && priceList.length) {
            return callback(itemListTemplate(priceList));
        } else {
            return callback(lineMessage.createTextMessage(format(botMessage.item_not_found, remainText)));
        }
    }

    const priceListRomExResponse = priceList => {
        if(priceList && priceList.length) {
            return callback(itemListRomExTemplate(priceList));
        } else {
            return callback(lineMessage.createTextMessage(format(botMessage.item_not_found, remainText)));
        }
    }

    switch(cmdType) {
        case cmdTypeConst.command: 
            return kafraCmd.run(remainText, replyMessage => callback(replyMessage));
        case cmdTypeConst.romexchange:
            romexchange.getLatestPrices(remainText.substr(1), priceListRomExResponse);
            break;
        case cmdTypeConst.poporing:
            if(remainText == 'trend' || remainText == 'trending') {
                poporing.getTrendingList(priceListResponse);
            } else {
                poporing.getLatestPrices(remainText, priceListResponse);
            }
            break;
        case cmdTypeConst.gacha:
            gacha.pull().then(result => {
                if(result) {
                    callback(result);
                }
            });
            break;
        case cmdTypeConst.chat:
            chat(text).then(answerMessage => {
                if(answerMessage) {
                    callback(answerMessage);
                }
            });
            break;
    }
}
