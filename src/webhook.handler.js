const eventHandler = require('./event.handler');

module.exports = (req, res) => {
    req.body.events.map(eventHandler)
    res.sendStatus(200)
}