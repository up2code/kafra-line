const itemTemplate = require('./../flex_templates/item');
const itemListTemplate = require('./../flex_templates/itemList');

const item = {
    name: 'familiar_card'
}

const priceData = {
    "price": 1116663,
    "volume": 69,
    "timestamp": 1550807997,
    "snapping": -1,
    "change1day": 46.41035592255872,
    "change3day": 162.9298328231693,
    "change7day": 147.70476748209865
}

//console.log(itemTemplate(item, priceData));

console.log(itemListTemplate([
    {
        display_name: 'Cyfar',
        priceData
    },
    {
        display_name: 'Cyfar2',
        priceData
    }
]));