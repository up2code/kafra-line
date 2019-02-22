const eventMessage = require('../src/event-message.handler');

eventMessage('$trend', message => {
    console.log(JSON.stringify(message))
})
