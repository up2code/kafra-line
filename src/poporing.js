const axios = require('axios');
const poporingConfig = require('./poporing.config');
const cache = require('./cache');

module.exports = {
    getAllLatestPrices: () => {
        const key = 'poporing_all_latest_prices';
        let url = poporingConfig.api + "/get_all_latest_prices";
        console.log('GET ' + url);

        return cache.get(key)
        .then((err, value) => {
            if(err) {
                console.log(err)
                return;
            }

            if(value) {
                return value;
            }

            return axios.get(url, { headers: poporingConfig.headers })
            .then(response => response.data)
            .then(response => response.data);
        });

        
    },
    getItemList: () => {
        const key = 'poporing_item_list';
        let url = poporingConfig.api + "/get_item_list/";

        console.log('GET ' + url);

        return cache.get(key)
        .then((err, value) => {

            if(err) {
                console.log(err)
                return;
            }

            if(value) {
                return value;
            }

            return axios.get(url, { headers: poporingConfig.headers })
            .then(response => response.data)
            .then(response => {
                cache.set(key, response.data)
                return response.data;
            });
        })
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