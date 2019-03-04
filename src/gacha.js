const Chance = require('chance')
const lineMessage = require('./line.message');

var currentGachaSet = [
    { "rate": 5, "value": { "type": "text", "value": "Emerald Heart (5.00%)" } },
    { "rate": 11, "value": { "type": "text", "value": "Eggshell Blue[1] (6.00%)" } },
    { "rate": 18, "value": { "type": "text", "value": "Flower Pistill (7.00%)" } },
    { "rate": 41, "value": { "type": "text", "value": "Rain Flute (23.00%)" } },
    { "rate": 69, "value": { "type": "text", "value": "Forest Crown[1] (28.00%)" } },
    { "rate": 100, "value": { "type": "text", "value": "Bell plant (31.00%)" } }
]

var allGachaSet = {
    'march_2019': {
        'name': 'March 2019',
        'items': [
            { "rate": 5, "value": { "type": "text", "value": "Emerald Heart (5.00%)" } },
            { "rate": 11, "value": { "type": "text", "value": "Eggshell Blue[1] (6.00%)" } },
            { "rate": 18, "value": { "type": "text", "value": "Flower Pistill (7.00%)" } },
            { "rate": 41, "value": { "type": "text", "value": "Rain Flute (23.00%)" } },
            { "rate": 69, "value": { "type": "text", "value": "Forest Crown[1] (28.00%)" } },
            { "rate": 100, "value": { "type": "text", "value": "Bell plant (31.00%)" } }
        ]
    }
}

function randomGacha(gachaSet) {
    var chance = new Chance()
    var result = chance.floating({min: 0, max: 100})
    console.log('dice : ' + result)
    return gachaSet.sort(function(a,b){ return a.rate - b.rate})
                    .find(function(s){ return result<=s.rate })
}

module.exports = {
    changeSet: name => {
        var newSet = allGachaSet[name];

        if(!newSet) return Promise.reject(new Error('Gacha set ' + name + ' not found'));

        currentGachaSet = newSet;

        return Promise.resolve({ "type": "text", "value": "Gacha set had changed to " + name })
    },
    pull: () => {

        var result = randomGacha(currentGachaSet).value;

        if(!result) return Promise.reject(new Error("Gacha result is null"))

        var response = null;

        switch(result.type) {
            case 'text':
                response = lineMessage.createTextMessage(result.value);
                break;
            case 'image':
                response = lineMessage.createImageMessage(result.value, result.value);
                break;
        }

        return Promise.resolve(response);
    }
}