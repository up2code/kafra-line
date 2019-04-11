const poporingRepo = require('./../src/poporing.repo');
const chai = require('chai');
const expect = chai.expect;

describe('poporing repo test', function () {

    it('test item contain name', function () {
        const item = {
          name: 'cyfar'
        }

        expect(poporingRepo.itemContainName(item, 'cy')).to.be.true;
    });

    it('test search item name', function (done) {
        poporingRepo.searchItemNames('cyfar')
        .then(result => {
          expect(result.length).to.be.above(0)
          expect(result[0]).to.be.an('object').that.has.any.keys('name', 'display_name', 'item_type', 'alt_display_name_list', 'image_url');
          done()
        })
    });

    it('test get latest prices', function (done) {
      poporingRepo.getLatestPrices('cyfar')
      .then(result => {
        expect(result.length).to.be.above(0)
        expect(result[0]).to.be.an('object').that.has.any.keys('name', 'display_name', 'item_type', 'alt_display_name_list', 'image_url', 'priceData');
        expect(result[0].priceData).to.be.an('object').that.has.any.keys('price', 'volume', 'timestamp', 'change1day', 'change3day', 'change7day');
        done()
      })
    });

    it('test get trending list', function (done) {
        poporingRepo.getTrendingList()
        .then(result => {
          expect(result).to.be.an('object').that.has.all.keys('success', 'data');
          expect(result.data.length).to.be.above(0)
          expect(result.data[0]).to.be.an('object').that.has.all.keys('item_name', 'data');
          expect(result.data[0].data).to.be.an('object').that.has.any.keys('price', 'volume', 'timestamp', 'change1day', 'change3day', 'change7day');
          done()
        })
    })

    it('test map item price data to master item', function (done) {
        const items = [
          {
            item_name: "cyfar",
            data: {
              price: 100,
              volume: 10,
              timestamp: 0
            }
          }
        ]
        poporingRepo.mapItemPriceDataList(items)
        .then(res => {
          expect(res.length).to.be.above(0)
          expect(res[0]).to.be.an('object').that.has.any.keys('name', 'display_name', 'item_type', 'image_url', 'priceData');
          expect(res[0].priceData).to.be.an('object').that.has.any.keys('price', 'volume', 'timestamp');
          done()
        })
    });

    it('test get card by card type and sort by price asc', function (done) {
      poporingRepo.getCards("blue")
      .then(result => {
        expect(result.length).to.be.above(0)
        done()
      })
    });
    
});