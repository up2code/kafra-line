const axios = require('axios');
const poporingConfig = require('./poporing.config');
const cache = require('./cache');

const cacheKey = {
    itemList: 'item_list',
    itemName: 'item_name',
    allLatestPrices: 'all_latest_prices'
}

const getItemList = callback => {
    
    let url = poporingConfig.api + "/get_item_list/";

    cache.get(cacheKey.itemList, (err, item_list) => {

        if(err) {
            console.log(err);
            return;
        }

        if(item_list) {
            console.log('Return cache ' + cacheKey.itemList)
            return callback(item_list);
        }

        console.log('GET ' + url);

        axios.get(url, { headers: poporingConfig.headers })
        .then(response => response.data)
        .then(response => {
            cache.set(cacheKey.itemList, response.data.item_list);
            callback(response.data.item_list);
        });

    });

}

const getLatestPrices = (itemNames, callback) => {
    let url = poporingConfig.api + "/get_latest_prices";
    console.log('POST ' + url);
    
    return axios({
        method: 'post',
        url: poporingConfig.api + "/get_latest_prices", 
        headers: poporingConfig.headers,
        data: itemNames
    })
    .then(response => response.data)
    .then(response => callback(response.data));
}

const getAllLatestPrices = callback => {
    let url = poporingConfig.api + "/get_all_latest_prices";
    console.log('GET ' + url);

    cache.get(cacheKey.allLatestPrices, (err, item_list) => {

        if(err) {
            console.log(err);
            return;
        }

        if(item_list) {
            console.log('Return cache ' + cacheKey.allLatestPrices)
            return callback(item_list);
        }

        console.log('GET ' + url);

        return axios.get(url, { headers: poporingConfig.headers })
        .then(response => response.data)
        .then(response => {
            cache.set(cacheKey.allLatestPrices, response.data);
            callback(response.data);
        });

    });
}

const getTrendingList = callback => {
    let url = poporingConfig.api + "/get_trending_list";
    console.log('GET ' + url);
    
    return axios.get(url, { headers: poporingConfig.headers })
        .then(response => response.data)
        .then(response => callback(response.data.item_list));
}

const itemContainName = (item, name) => {
    return item.name.toLocaleLowerCase().includes(name) || 
    item.display_name.toLocaleLowerCase().includes(name) || 
    item.alt_display_name_list.find(i => i.toLocaleLowerCase().includes(name))
}

const limitArraySize = (ar, maxSize) => {
    return (ar && ar.length > maxSize)? ar.splice(maxSize, ar.length - maxSize) : ar;
}

const filterItemNamesMatched = (itemName, itemList)  => {
    itemName = itemName.toLocaleLowerCase();

    let items = itemList.filter(item => itemContainName(item, itemName));

    return limitArraySize(items, 10);
}

const mapItemPriceData = (items, priceList) => {
    return items.map(i => {
        i.priceData = priceList.find(d => d.item_name == i.name).data;
        return i;
    })
} 

module.exports = {
    getLatestPrices: (query, callback) => {
        getItemList(itemList => {
            const items = filterItemNamesMatched(query, itemList);

            if(!items || !items.length) {
                return callback(null);
            }

            return getLatestPrices(
                items.map(i => i.name), 
                priceList => callback(mapItemPriceData(items, priceList))
            );
        })
    },
    getTrendingList: callback => {
        getTrendingList(trendItems => {

            getItemList(itemList => {

                getLatestPrices(
                    trendItems.map(i => i.name), 
                    priceList => callback(mapItemPriceData(trendItems.map(ti => {
                        const a = itemList.find(il => il.name == ti.name);

                        if(a) {
                            ti.display_name = a.display_name;
                            ti.image_url = a.image_url;
                        } {
                            ti.display_name = ti.name;
                        }
                        
                        return ti;
                    }), priceList))
                );
            });


            
        });
    },
    listCardSortByPriceAsc: (cardType, callback) => {

        if(!cardType) return;

        getItemList(itemList => {
            
            getAllLatestPrices(items => {
                let cards = items.filter(i => i.item_name.endsWith('card'))
                .map(i => {
                    if(i.data.price == 0) {
                        i.data.price = i.data.last_known_price;
                    }

                    return i;
                })
                .filter(i => (i.data.price > 0 && i.data.price < 2000000))
                .sort((a, b) => {
                    if (a.data.price < b.data.price)
                    return -1;
                    if (a.data.price > b.data.price)
                        return 1;
                    return 0;
                })
                .map(i => {
                    let itemMetaData = itemList.find(il => il.name == i.item_name);

                    if(itemMetaData) {
                        i.item_type = itemMetaData.item_type;
                        i.image_url = itemMetaData.image_url;
                        i.display_name = itemMetaData.display_name;
                    } else {
                        i.item_type = "Unknown";
                        i.display_name = i.name;
                    }

                    return i;
                })
                .filter(i => {
                    if(cardType == 'grey') return /Common.*Card/.test(i.item_type);
                    if(cardType == 'green') return /Uncommon.*Card/.test(i.item_type);
                    if(cardType == 'blue') return /Rare.*Card/.test(i.item_type);
                    return true;
                })
                .map(i => i.display_name + '(' + i.item_type + '):' + i.data.price.toLocaleString())
                .filter((v,i) => i <= 10)
                .join('\n')
                .substring(0, 2000);

                callback(cards);
            });

        });
        
    }
}