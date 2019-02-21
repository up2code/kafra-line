'use strict';

const lineConfig = require('./src/line.config');
const webhookHandler = require('./src/webhook.handler');
const express = require('express');

const app = express();

app.post('/callback', lineConfig.middleware, webhookHandler);

app.get('/',(req, res) => {
    res.send('hello kafra')
})

// listen on port
const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});