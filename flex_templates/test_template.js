module.exports = generate = () => {
    return {
        type: 'flex',
        altText: 'Test flex message',
        contents: {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "Test Flex",
                  "weight": "bold",
                  "size": "xl"
                }
              ]
            }
        }
    }
}