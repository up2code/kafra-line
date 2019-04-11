const romexchange = require('./romexchange');

const mapItemData = i => {
  i.display_name = i.name;
  let itemSEA = i.sea;
  i.priceData = {
      week: itemSEA.week.change,
      price: itemSEA.latest,
      latest_time: itemSEA.latest_time
  }

  return i;
}

const getLatestPrices = query => {
  return romexchange.getLatestPrices(query)
  .then(items => items.map(mapItemData));
}

module.exports = {
  getLatestPrices
}