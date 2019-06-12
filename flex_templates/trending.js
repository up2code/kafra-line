const generateItemLine = (name, price) => {
  return {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "text",
        "text": name,
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
    section.push(generateItemLine(i.display_name, i.price));
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

  console.log(data);

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