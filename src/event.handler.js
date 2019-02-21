const eventMessageHandler = require('./event-message.handler');
const lineMessage = require('./line.message');

const line = require('./line.config');

const replyMessage = (event, message) => {
  return line.client.replyMessage(event.replyToken, message);
}

module.exports = event => {

    if(event != 'message' || event.message.type != 'text') {
        return;
    }

    eventMessageHandler(event.message.text, message => replyMessage(event, message));
}