const firebase = require('./firebase');
const eventListTemplate = require('./../flex_templates/eventList');
const poporingRepo = require('./poporing.repo');
const lineMessage = require('./line.message');

module.exports = {
    'events': () => firebase.getAllEvents().then(events => events.filter(e => !e.weekly)).then(eventListTemplate),
    'weeklyevents': () => firebase.getAllEvents().then(events => events.filter(e => e.weekly)).then(eventListTemplate),
    'greycards': () => poporingRepo.getCards('grey').then(lineMessage.createTextMessage),
    'greencards': () => poporingRepo.getCards('greencards').then(lineMessage.createTextMessage),
    'bluecards': () => poporingRepo.getCards('blue').then(lineMessage.createTextMessage)
}