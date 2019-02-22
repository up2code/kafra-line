const eventMessage = require('../src/event-message.handler');

eventMessage('$biotite', message => {
    console.log(JSON.stringify(message))
})
