const itemTemplate = require('./item')

/*
 [
   {
      "name": "cyfar"
      "display_name": "Cyfar",
      "image_url": "https://via.placeholder.com/50x50?text=?",
      "priceData": {
        "price": 100,
        "volume": 100,
        "timestamp": 123456,
        "change1day": 32.12,
        "change3day": 32.12,
        "change7day": 32.12,
      }
   }
 ]
*/

const generateFlex = items => {
  return {
    type: 'flex',
    altText: 'Search result',
    contents: { type: 'carousel', contents: items.map(i => itemTemplate(i, i.priceData))}
  }
}

const generatePlainText = items => {
  return {
    type: 'text',
    text: items.map(i => `${i.display_name}: ${i.priceData.price}z`).join('\n')
  }
}

module.exports = generatePlainText;