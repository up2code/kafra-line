module.exports = generate = (event) => {

    const hero = {
        "type":"image",
        "url": event.thumbUrl,
        "size":"full",
        "aspectRatio":"25:10",
        "aspectMode":"cover"
    };

    if(event.detailUrl) {
      hero.action = {
        "type":"uri",
        "uri": event.detailUrl
      }
    }

    return {
      "type":"bubble",
      "hero": hero,
      "body":{
         "type":"box",
         "layout":"vertical",
         "contents":[
            {
               "type":"text",
               "text": event.name,
               "weight":"bold",
               "size":"md"
            },
            {
    
               "type": "box",
               "layout": "vertical",
               "contents": [
                 {
                   "type": "box",
                   "layout": "vertical",
                   "contents": [
                     {
                       "type": "box",
                       "layout": "baseline",
                       "spacing": "sm",
                       "contents": [
                         {
                           "type": "text",
                           "text": "Start",
                           "weight": "bold",
                           "size": "sm",
                           "flex": 1
                         },
                         {
                           "type": "text",
                           "text": event.start,
                           "wrap": true,
                           "color": "#666666",
                           "size": "sm",
                           "flex": 5
                         }
                       ]
                     }
                   ]
                 },
                 {
                   "type": "box",
                   "layout": "vertical",
                   "contents": [
                     {
                       "type": "box",
                       "layout": "baseline",
                       "spacing": "sm",
                       "contents": [
                         {
                           "type": "text",
                           "text": "End",
                           "weight": "bold",
                           "size": "sm",
                           "flex": 1
                         },
                         {
                           "type": "text",
                           "text": event.end,
                           "wrap": true,
                           "color": "#666666",
                           "size": "sm",
                           "flex": 5
                         }
                       ]
                     }
                   ]
                 },
                 {
                   "type": "box",
                   "layout": "horizontal",
                   "contents": [
                     {
                       "type": "text",
                       "color": "#aaaaaa",
                       "text": event.fromNow
                     }
                   ]
                 }
               ]
             },
            {
               "type":"text",
               "text": event.description,
               "margin": "lg",
               "size":"sm",
               "wrap":true
            }
         ]
      }
   }
}