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
    text: items.map(i => {
      let price = (i.priceData.price) ? i.priceData.price.toLocaleString() + 'z' : 'Unknown';
      let volume = (i.priceData.volume) ? i.priceData.volume.toLocaleString() + 'ea' : '0ea';

      return `${i.display_name}: ${volume}|${price}`;
      } 
    ).join('\n')
  }
}

module.exports = generateFlex;