const axios = require('axios');
const romexConfig = require('./romexchange.config');

const limitArraySize = (ar, maxSize) => {
    return (ar && ar.length > maxSize)? ar.splice(maxSize, ar.length - maxSize) : ar;
}

const getLatestPrices = item => {
    return axios.get(romexConfig.api, {
        params: {
            item,
            exact: false,
            slim: true
        }
    })
    .then(response => response.data);
}

module.exports = {
    getLatestPrices
}

// getPriceHistory(item, items => {
//     if(!items) return callback(null);

//     let mapItems = items.map(i => {
//         i.display_name = i.name;
//         let itemSEA = i.sea;
//         i.priceData = {
//             week: itemSEA.week.change,
//             price: itemSEA.latest,
//             latest_time: itemSEA.latest_time
//         }

//         return i;
//     });

//     callback(limitArraySize(mapItems, 10));
// });