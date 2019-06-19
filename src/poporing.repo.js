const poporing = require('./poporing');
const Fuse = require('fuse.js');
const chart = require('./chart');

const mapLastKnownPrice = i => {
  if(i.data.price == 0) i.data.price = i.data.last_known_price;
  return i;
}

const sortPriceAsc = (a, b) => {
  if (a.priceData.price < b.priceData.price)
  return -1;
  if (a.priceData.price > b.priceData.price)
      return 1;
  return 0;
}

const sortPriceDesc = (a, b) => {
  if (a.priceData.price > b.priceData.price)
  return -1;
  if (a.priceData.price < b.priceData.price)
      return 1;
  return 0;
}

const itemContainName = (item, name) => {
  return item.name.toLocaleLowerCase().includes(name) || 
  item.display_name.toLocaleLowerCase().includes(name) || 
  item.alt_display_name_list.find(i => i.toLocaleLowerCase().includes(name))
}

const searchItemNames = name => {
  return poporing.getItemList()
  .then(data => data.item_list)
  .then(items => {

    var options = {
      threshold: 0.3,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [ 'name', 'display_name', 'alt_display_name_list']
    }
    var result = new Fuse(items, options).search(name);

    return result;
  })
  .then(items => items.filter((v,i) => i <= 5));
}

const mapItemPriceDataList = items => {

  if(!items.length) return [];

  if(!items[0].name && !items[0].data) {
    throw "Invalid parameter type for mapItemPriceDataList. Item should contain field name and data.";
  }

  let itemNames = items.map(i => i.item_name);

  return poporing.getItemList()
  .then(response => response.item_list)
  .then(masterItems => masterItems.filter(mi => itemNames.includes(mi.name)))
  .then(masterItems => masterItems.map(mi => {
    mi.priceData = items.find(i => i.item_name == mi.name).data;
    mi.priceData.price = (mi.priceData.price == 0 && mi.priceData.last_known_price > 0)? 
      mi.priceData.last_known_price : mi.priceData.price;
    return mi;
  }))
}

const groupTrendingItems = data => {

  const groups = ['item_list', 'item_list_full_1day', 'item_list_full_3day', 'item_list_full_7day'];

  groups.forEach(group => {
    data[group] = data[group].map(i => {
      i.group = group;
      return i;
    });
  });

  return data;
}

const getLatestPrices = query => {
    return searchItemNames(query)
    .then(result => result.map(i => i.name))
    .then(poporing.getLatestPrices)
    .then(response => response.data)
    .then(mapItemPriceDataList)
}

const getPriceHistories = names => {
  return Promise.all(names.map(poporing.getPriceHistory));
}

const getTrendingList = day => {
  return poporing.getTrendingList(day)
  .then(items => items.map(i => i.name))
  .then(poporing.getLatestPrices)
  .then(response => response.data)
  .then(mapItemPriceDataList);
}

const getAllTrendingList = () => {

  return poporing.getTrendingList()
  .then(data => {

    const allItems = [].concat(data.item_list)
      .concat(data.item_list_full_1day)
      .concat(data.item_list_full_3day)
      .concat(data.item_list_full_7day)
    const names = allItems.map(i => i.name);

    return poporing.getLatestPrices(names)
    .then(response => response.data)
    .then(mapItemPriceDataList)
    .then(itemPrices => {

      const newData = {};
      newData.trend = data.item_list.map(i => {
        i.priceData = itemPrices.find(ip => ip.name === i.name).priceData;
        i.price = (i.priceData.price)? i.priceData.price.toLocaleString() : 'Unknown';
        i.volume = (i.priceData.volume)? i.priceData.volume.toLocaleString() : '0';
        return i;
      });

      newData.trend1d = data.item_list_full_1day.map(i => {
        i.priceData = itemPrices.find(ip => ip.name === i.name).priceData;
        i.price = (i.priceData.price)? i.priceData.price.toLocaleString() : 'Unknown';
        i.volume = (i.priceData.volume)? i.priceData.volume.toLocaleString() : '0';
        i.score = i.priceData.change1day;
        return i;
      });

      newData.trend3d = data.item_list_full_3day.map(i => {
        i.priceData = itemPrices.find(ip => ip.name === i.name).priceData;
        i.price = (i.priceData.price)? i.priceData.price.toLocaleString() : 'Unknown';
        i.volume = (i.priceData.volume)? i.priceData.volume.toLocaleString() : '0';
        i.score = i.priceData.change3day;
        return i;
      });

      newData.trend7d = data.item_list_full_7day.map(i => {
        i.priceData = itemPrices.find(ip => ip.name === i.name).priceData;
        i.price = (i.priceData.price)? i.priceData.price.toLocaleString() : 'Unknown';
        i.volume = (i.priceData.volume)? i.priceData.volume.toLocaleString() : '0';
        i.score = i.priceData.change7day;
        return i;
      });
      return newData;
    })
    .then(trends => {
        let names = trends.trend.map(i => i.name);
        return getPriceHistories(names)
        .then(arr => {

          trends.trend.map(t => {
            t.priceHistory = arr.find(a => a.item_name === t.name).data_list;
            t.chartUrl = chart.genPoporingChartUrl(t.priceHistory);
            return t;
          });

          return trends;
        });
    });
  });
}

const getCards = cardType => {

  const limitPrice = 2000000
  const limitRecords = 10;

  return poporing.getAllLatestPrices()
  .then(items => items.filter(i => i.item_name.endsWith('card')))
  .then(items => items.map(mapLastKnownPrice))
  .then(items => items.filter(i => i.data.price > 0 && i.data.price < limitPrice))
  .then(mapItemPriceDataList)
  .then(items => items.filter(i => {
    if(cardType == 'grey') return /Common.*Card/.test(i.item_type);
    if(cardType == 'green') return /Uncommon.*Card/.test(i.item_type);
    if(cardType == 'blue') return /Rare.*Card/.test(i.item_type);
    return false;
  }))
  .then(items => items.sort(sortPriceAsc))
  .then(items => items.map(i => i.display_name + '(' + i.item_type + '):' + i.priceData.price.toLocaleString()))
  .then(items => items.filter((v,i) => i <= limitRecords).join('\n').substring(0, 2000));
}

const getActiveItemPricesByCategory = category => {
  return poporing.getItemList()
  .then(data => data.item_list)
  .then(items => items.filter(i => i.item_type === category))
  .then(items => items.map(i => i.name))
  .then(poporing.getLatestPrices)
  .then(response => response.data)
  .then(mapItemPriceDataList)
  .then(items => items.sort(sortPriceDesc))
  .then(items => items.filter(i => i.priceData.change3day));
}

module.exports = {
  mapItemPriceDataList,
  itemContainName,
  searchItemNames,
  getLatestPrices,
  getTrendingList,
  getAllTrendingList,
  getCards,
  getActiveItemPricesByCategory
}