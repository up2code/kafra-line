const firebase = require('./firebase');
const eventListTemplate = require('./../flex_templates/eventList');
const trendingTemplate = require('./../flex_templates/trending');
const itemByCategoryTemplate = require('./../flex_templates/itemByCategory');
const poporingRepo = require('./poporing.repo');
const lineMessage = require('./line.message');

module.exports = {
    'events': () => firebase.getNonWeeklyEvents().then(eventListTemplate),
    'weeklyevents': () => firebase.getWeeklyEvents().then(eventListTemplate),
    'greycards': () => poporingRepo.getCards('grey').then(lineMessage.createTextMessage),
    'greencards': () => poporingRepo.getCards('greencards').then(lineMessage.createTextMessage),
    'bluecards': () => poporingRepo.getCards('blue').then(lineMessage.createTextMessage),
    'trending': () => poporingRepo.getAllTrendingList().then(trendingTemplate),
    'materials': () => poporingRepo.getActiveItemPricesByCategory('Material').then(itemByCategoryTemplate),
}