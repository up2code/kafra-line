const poporingRepo = require('./poporing.repo');
const romexchangeRepo = require('./romexchange.repo');
const itemListTemplate = require('../flex_templates/itemList');
const itemListRomExTemplate = require('../flex_templates/itemList.romexchange');
const kafraCmd = require('./kafra.cmd');
const botMessage = require('./message.default');
const format = require('string-format');
const lineMessage = require('./line.message');
const chat = require('./chat');
const gacha = require('./gacha');
const Chance = require('chance')
const chance = new Chance();

const cmdTypeConst = {
    command: 'cmd',
    poporing: 'poporing',
    romexchange: 'romexchange',
    chat: 'chat',
    gacha: 'gacha',
    reminder: 'reminder'
}

const getMessageCmdType = text => {
    if(text.startsWith('!')) return cmdTypeConst.command;
    if(text.startsWith('$$')) return cmdTypeConst.romexchange;
    if(text.startsWith('$')) return cmdTypeConst.poporing;
    return cmdTypeConst.chat;
}

module.exports = event => {

    const text = event.message.text;

    if(!text) return chance.pickone(botMessage.item_not_found);

    const cmdType = getMessageCmdType(text);

    console.log('command type : ' + cmdType)

    const remainText = text.substr(1);

    const priceListResponse = priceList => {
        if(priceList && priceList.length) {
            return itemListTemplate(priceList);
        } else {
            return lineMessage.createTextMessage(format(chance.pickone(botMessage.item_not_found), remainText));
        }
    }

    const priceListRomExResponse = priceList => {
        if(priceList && priceList.length) {
            return itemListRomExTemplate(priceList);
        } else {
            return lineMessage.createTextMessage(format(chance.pickone(botMessage.item_not_found), remainText));
        }
    }

    switch(cmdType) {
        case cmdTypeConst.command: 
            return kafraCmd.run(remainText);
        case cmdTypeConst.romexchange:
            return romexchangeRepo.getLatestPrices(remainText.substr(1)).then(priceListRomExResponse);
        case cmdTypeConst.poporing:
            switch(remainText) {
                case 'trend':
                case 'trending':
                    return poporingRepo.getTrendingList().then(priceListResponse);
                case 'trend24h':
                case 'trend1d':
                    return poporingRepo.getTrendingList(1).then(priceListResponse);
                case 'trend3d':
                    return poporingRepo.getTrendingList(3).then(priceListResponse);
                case 'trend7d':
                    return poporingRepo.getTrendingList(7).then(priceListResponse);
                default:
                    return poporingRepo.getLatestPrices(remainText).then(priceListResponse);
            }
        case cmdTypeConst.chat:
            return chat(text);
    }
}
