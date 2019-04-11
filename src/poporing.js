const axios = require('axios');
const poporingConfig = require('./poporing.config');

module.exports = {
    getAllLatestPrices: () => {
        let url = poporingConfig.api + "/get_all_latest_prices";
        console.log('GET ' + url);

        return axios.get(url, { headers: poporingConfig.headers })
        .then(response => response.data)
        .then(response => response.data);
    },
    getItemList: () => {
        let url = poporingConfig.api + "/get_item_list/";

        console.log('GET ' + url);

        return axios.get(url, { headers: poporingConfig.headers })
        .then(response => response.data)
        .then(response => response.data);
    },
    getLatestPrices: (names) => {
        let conf = {
            method: 'post',
            url: poporingConfig.api + "/get_latest_prices", 
            headers: poporingConfig.headers,
            data: names
        }
        console.log(JSON.stringify(conf));
        
        return axios(conf)
        .then(response => response.data);
    },
    getTrendingList: () => {
        let url = poporingConfig.api + "/get_trending_list";
        console.log('GET ' + url);
        
        return axios.get(url, { headers: poporingConfig.headers })
            .then(response => response.data)
            .then(response => response.data.item_list);
    }
}