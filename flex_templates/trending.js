

/*
[
  { 
    name: 'hydra_blueprint',
    display_name: 'Hydra Blueprint',
    score: 38.94276304889254,
    price: '1,568,190',
    volume: '12',
    priceData: { price: 1568190,
      volume: 12,
      timestamp: 1560407422,
      snapping: -1,
      change1day: -2.741887143777221,
      change3day: 7.469971333391356,
      change7day: 38.94276304889254,
      vchange1day: 500,
      vchange3day: 500,
      vchange7day: 1100,
      change6hour: 0,
      changeprevious: 0,
      vchange6hour: -8.333333333333334,
      vchangeprevious: -8.333333333333334,
      previous_timestamp: 1560399197 
    },
  } 
]
*/

const generateItemLine1 = (item) => {
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
            "text": `${item.volume} ea`,
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

  let score = (item.score) ? item.score : 0;
  let color = (item.score > 0)? '#64dd17' : '#b71c1c';
  let scoreText = (item.score == 0)? "0" 
  : (item.score > 0)? "+" + score.toFixed(2) + "%"
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
            "text": `${item.price} z`,
            "size": "sm",
            "color": "#111111",
            "align": "end"
          }
        ]
      }
    ]
  }
}

const generateTrendChart = url => {
  return {
    "type": "image",
    "url": url,
    "size": "full"
  };
}

const generateTrendingSection = (name, items) => {
  let section = [];

  let header = {
    "type": "text",
    "text": name,
    "weight": "bold",
    "color": "#1DB446",
    "size": "sm"
  };

  let separator = {
    "type": "separator",
    "margin": "xxl"
  };

  section.push(header);

  items.forEach(i => {
    section.push(generateItemLine1(i));
    section.push(generateItemLine2(i));
  });

  section.push(separator);

  return section;
}

const generateLastLine = () => {
  return {
    "type": "box",
    "layout": "horizontal",
    "margin": "md",
    "contents": [
      {
        "type": "text",
        "text": "Source by poporing.life",
        "size": "xs",
        "color": "#aaaaaa",
        "flex": 0
      }
    ]
  }
}

/*
 data = {
   "trend": [
    { "name": "Anacondaq Card", "price": 8197653 }
   ],
   "trend1d": [
    { "name": "Anacondaq Card", "price": 8197653 }
   ],
   "trend3d": [
    { "name": "Anacondaq Card", "price": 8197653 }
   ],
   "trend7d": [
    { "name": "Anacondaq Card", "price": 8197653 }
   ]
 }
*/

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
module.exports = generate = data => {

  const trendBox = generateTrendingSection('TOP TRENDING', data.trend);
  const trend1dBox = generateTrendingSection('24 HOURS', data.trend1d);
  const trend3dBox = generateTrendingSection('3 DAYS', data.trend3d);
  const trend7dBox = generateTrendingSection('7 DAYS', data.trend7d);

  return {
    type: 'flex',
    altText: 'Search result',
    contents: { 
      type: 'carousel', 
      contents: [
        generateBubble(trendBox),
        generateBubble(trend1dBox),
        generateBubble(trend3dBox),
        generateBubble(trend7dBox)
      ]
    }
  };

  
}