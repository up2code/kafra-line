const moment = require('moment')
const romexchangeConfig = require('../src/romexchange.config');

const generatePriceDiffBox = (label, priceDiff) => {

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

    let actionUri = encodeURI(romexchangeConfig.actionUri + item.name);
    
    return {
        "type": "bubble",
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
                      "text": "" + (priceData.price)? priceData.price.toLocaleString() : 'Unknown',
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
                      "text": "Last update " + (priceData.latest_time)? moment(priceData.latest_time).fromNow() : 'unknow',
                      "flex": 0,
                      "size": "sm",
                      "color": "#aaaaaa"
                    }
                  ]
                }
              ]
            },
            generatePriceDiffBox('Week', priceData.week),
            {
                  "type":"box",
                  "layout":"baseline",
                  "contents":[
                    {
                      "type":"text",
                      "text":"Source by www.romexchange.com",
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