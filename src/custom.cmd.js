const firebase = require('./firebase');
const eventListTemplate = require('./../flex_templates/eventList');
const testTemplate = require('./../flex_templates/test_template');
const trendingTemplate = require('./../flex_templates/trending');
const itemByCategoryTemplate = require('./../flex_templates/itemByCategory');
const poporingRepo = require('./poporing.repo');
const lineMessage = require('./line.message');

module.exports = {
    'events': () => firebase.getNonWeeklyEvents().then(eventListTemplate),
    'weeklyevents': () => firebase.getWeeklyEvents().then(eventListTemplate),
    'greycards': () => poporingRepo.getCards('grey').then(data => itemByCategoryTemplate('Cheapest common cards', data)),
    'greencards': () => poporingRepo.getCards('greencards').then(data => itemByCategoryTemplate('Cheapest uncommon cards', data)),
    'bluecards': () => poporingRepo.getCards('blue').then(data => itemByCategoryTemplate('Cheapest rare cards', data)),
    'trending': () => poporingRepo.getAllTrendingList().then(trendingTemplate),
    'materials': () => poporingRepo.getActiveItemPricesByCategory('Material').then(data => itemByCategoryTemplate('Material prices', data)),
    'testtemplate': () => testTemplate(),
}