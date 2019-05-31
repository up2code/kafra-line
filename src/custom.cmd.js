const firebase = require('./firebase');
const eventListTemplate = require('./../flex_templates/eventList');

module.exports = {
    'events': () => firebase.getAllEvents().then(eventListTemplate)
}