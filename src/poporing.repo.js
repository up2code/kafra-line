const poporing = require('./poporing');


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

const itemContainName = (item, name) => {
  return item.name.toLocaleLowerCase().includes(name) || 
  item.display_name.toLocaleLowerCase().includes(name) || 
  item.alt_display_name_list.find(i => i.toLocaleLowerCase().includes(name))
}

const searchItemNames = name => {
  return poporing.getItemList()
  .then(data => data.item_list)
  .then(items => items.filter(i => itemContainName(i, name.toLocaleLowerCase())))
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
    return mi;
  }))
}

const getLatestPrices = query => {
    return searchItemNames(query)
    .then(result => result.map(i => i.name))
    .then(poporing.getLatestPrices)
    .then(response => response.data)
    .then(mapItemPriceDataList)
}

const getTrendingList = () => {
  return poporing.getTrendingList().
  then(items => items.map(i => i.name))
  .then(poporing.getLatestPrices)
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

module.exports = {
  mapItemPriceDataList,
  itemContainName,
  searchItemNames,
  getLatestPrices,
  getTrendingList,
  getCards
}