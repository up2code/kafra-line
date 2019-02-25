const itemTemplate = require('./item.romexchange')

module.exports = generate = (items) => {
    return {
        type: 'flex',
        altText: 'Search result',
        contents: { type: 'carousel', contents: items.map(i => itemTemplate(i, i.priceData))}
      }
};