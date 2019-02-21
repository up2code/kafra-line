const itemTemplate = require('./item')

module.exports = generate = (items) => {
    return { type: 'carousel', contents: items.map(i => itemTemplate(i, i.priceData.price, i.priceData.volume))}
};