const moment = require('moment')
const poporingConfig = require('../src/poporing.config');

const generatePriceDiffBox = (label, priceDiff) => {

  priceDiff = (priceDiff) ? priceDiff : 0;
  
  const priceColor = (priceDiff < 0)? '#b71c1c' : '#64dd17';

  return {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "text",
        "text": label,
        "size":"xs"
      },
      {
        "type": "filler"
      },
      {
        "type": "text",
        "text": priceDiff.toFixed(2) + "%",
        "color": priceColor,
        "weight": "bold",
        "size":"xs",
        "align": "end"
      }
    ]
  }
}

module.exports = generate = (item, priceData) => {

    let price = (priceData.price) ? priceData.price.toLocaleString() : 'Unknown';
    let volume = (priceData.volume) ? priceData.volume.toLocaleString() : 'Unknown';
    let imageUrl = (item.image_url)? [poporingConfig.imageUrl, item.image_url].join('/'): 'https://via.placeholder.com/50x50?text=?';
    let actionUri = poporingConfig.actionUri + item.name;
    
    return {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": imageUrl,
          "size": "md",
          "aspectRatio": "5:8",
          "aspectMode": "fit",
          "action": {
            "type": "uri",
            "uri": actionUri
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "md",
          "action": {
            "type": "uri",
            "uri": actionUri
          },
          "contents": [
            {
              "type": "text",
              "text": item.display_name,
              "size": "md",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Price: ",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": price,
                      "weight": "bold",
                      "margin": "sm",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": "z",
                      "size": "sm",
                      "margin": "sm",
                      "color": "#aaaaaa",
                      "flex": 0
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Volume: ",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": volume,
                      "weight": "bold",
                      "margin": "sm",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": "ea",
                      "size": "sm",
                      "margin": "sm",
                      "color": "#aaaaaa",
                      "flex": 0
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Last update " + (priceData.timestamp) ? moment.unix(priceData.timestamp).fromNow() : 'unknow',
                      "flex": 0,
                      "size": "sm",
                      "color": "#aaaaaa"
                    }
                  ]
                }
              ]
            },
            generatePriceDiffBox('1 day', priceData.change1day),
            generatePriceDiffBox('3 day', priceData.change3day),
            generatePriceDiffBox('7 day', priceData.change7day),
            {
                  "type":"box",
                  "layout":"baseline",
                  "contents":[
                    {
                      "type":"text",
                      "text":"Source by poporing.life",
                      "flex":0,
                      "size":"sm",
                      "color":"#aaaaaa"
                    }
                  ]
            }
          ]
        }
      }
}