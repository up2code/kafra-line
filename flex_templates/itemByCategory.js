const _ = require('underscore');

/*
[
  { name: 'time_twister',
    display_name: 'Time Twister',
    item_type: 'Material',
    update_priority: '',
    alt_display_name_list: [],
    image_url: null,
    track: { sea: true, global: true },
    priceData:
     { price: 678162,
       volume: 15376,
       timestamp: 1560920695,
       snapping: -1,
       change1day: -2.7820786183832182,
       change3day: -5.684040096614083,
       change7day: -10.38055803775499,
       vchange1day: 1.098034058780985,
       vchange3day: 31.194539249146757,
       vchange7day: 13.989176365927793,
       change6hour: -1.5021484542041577,
       changeprevious: -1.5021484542041577,
       vchange6hour: 0.24775068457426,
       vchangeprevious: 0.24775068457426,
       previous_timestamp: 1560908757 } 
    }
]
*/

const generateItemLine1 = (item) => {

  let volume = (item.priceData.volume)? item.priceData.volume.toLocaleString() : '0';

  return {
    "type": "box",
    "layout": "horizontal",
    "margin": "xl",
    "contents": [
      {
        "type": "text",
        "text": item.display_name,
        "size": "sm",
        "color": "#555555",
        "flex": 1
      },
      {
        "type": "box",
        "layout": "horizontal",
        "flex": 1,
        "contents": [
          {
            "type": "text",
            "text": `${volume} ea`,
            "size": "sm",
            "color": "#111111",
            "align": "end"
          }
        ]
      }
    ]
  }
}

const generateItemLine2 = (item) => {

  let price = (item.priceData.price)? item.priceData.price.toLocaleString() : 'unknown';

  let score = (item.priceData.change3day != null) ? item.priceData.change3day : 0;
  let color = (score > 0)? '#64dd17' : '#b71c1c';
  let scoreText = (score == 0)? "0" 
  : (score > 0)? "+" + score.toFixed(2) + "%"
  : score.toFixed(2) + "%";

  return {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "text",
        "text": scoreText,
        "size": "sm",
        "color": color,
        "flex": 1
      },
      {
        "type": "box",
        "layout": "horizontal",
        "flex": 1,
        "contents": [
          {
            "type": "text",
            "text": `${price} z`,
            "size": "sm",
            "color": "#111111",
            "align": "end"
          }
        ]
      }
    ]
  }
}

const generateSection = items => {
  let section = [];

  let separator = {
    "type": "separator",
    "margin": "xxl"
  };

  items.forEach(i => {
    section.push(generateItemLine1(i));
    section.push(generateItemLine2(i));
  });

  section.push(separator);

  return section;
}

const generateBubble = content => {
  return {
    "type": "bubble",
    "styles": {
      "footer": {
        "separator": true
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": content
    }
  }
}
module.exports = generate = (altText, items) => {

  const maxItemPerPage = 10;
  const contents = [];

  chunkItems = _.chunk(items, maxItemPerPage);

  console.log('Total items : ' + items.length);
  console.log('Total pages : ' + chunkItems.length);
  console.log('Max item per page : ' + maxItemPerPage);

  chunkItems.forEach(items => {
    contents.push(generateBubble(generateSection(items)));
  });

  return {
    type: 'flex',
    altText,
    contents: { 
      type: 'carousel', 
      contents
    }
  };

  
}