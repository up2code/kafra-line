const moment = require('moment')
const poporingConfig = require('../src/poporing.config');

module.exports = generate = (item, price, volume) => {

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
                      "text": "" + (price)? price.toLocaleString() : 'Unknown',
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
                      "text": "" + (volume)? volume.toLocaleString() : 'Unknown',
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
                }
              ]
            }
          ]
        }
      }
}