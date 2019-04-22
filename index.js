'use strict';

const lineConfig = require('./src/line.config');
const eventMessageHandler = require('./src/event-message.handler');
const express = require('express');

const app = express();

app.post('/callback', lineConfig.middleware, (req, res) => {
  req.body.events.map(event => {

    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return;
    }

    const sourceId = (event.source.groupId) ?  event.source.groupId : event.source.userId;

    return eventMessageHandler(event).then(message => {
      if(message) {
        console.log('Reply :' + JSON.stringify(message));
        lineConfig.client.replyMessage(event.replyToken, message)
        .catch((err) => {
            console.error(err);
            lineConfig.client.pushMessage(sourceId, { type: 'text', text: 'Something wrong inside me....'})
        });
      }
      
    });
  });
  res.sendStatus(200)
});

app.get('/',(req, res) => {
    res.send('hello kafra')
})

// listen on port
const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});