'use strict';

const lineConfig = require('./src/line.config');
const eventMessageHandler = require('./event-message.handler');
const express = require('express');

const app = express();

app.post('/callback', lineConfig.middleware, (req, res) => {
  req.body.events.map(event => {
      if(event != 'message' || event.message.type != 'text') {
          return;
      }

      console.log(event.message.text);

      return eventMessage(event.message.text, message => {
          console.log('Reply :' + JSON.stringify(message));
          lineConfig.client.replyMessage(event.replyToken, message);
      })
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