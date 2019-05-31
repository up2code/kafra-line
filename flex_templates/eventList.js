const eventTemplate = require('./event')

module.exports = generate = (events) => {
    return {
        type: 'flex',
        altText: 'กิจกรรม/Events',
        contents: { type: 'carousel', contents: events.map(e => eventTemplate(e))}
      }
};