const eventTemplate = require('./event')

/*
[
  {
    "thumbUrl": "https://abc.png",
    "detailUrl": "https://google.com",
    "name": "Event name",
    "start": "Start time text",
    "end": "End time text",
    "description": "description",
    "fromNow": "Count from now"
  }
]
*/
const generateFlex = events => {
  return {
    type: 'flex',
    altText: 'กิจกรรม/Events',
    contents: { type: 'carousel', contents: events.map(e => eventTemplate(e))}
  }
}

const generatePlainText = events => {

  return {
    type: 'text',
    text: events.map(e => `*${e.name}*\n${e.start} - ${e.end}\n${e.description}`).join('\n\n')
  }
}

module.exports = generateFlex;