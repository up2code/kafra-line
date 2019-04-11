const poporing = require('./../src/poporing');
const chai = require('chai');
const expect = chai.expect;

describe('poporing api test', function () {

    it('test get latest price', function (done) {
         poporing.getLatestPrices(["cyfar"])
         .then(res => {
            expect(res).to.be.an('object').that.has.all.keys('success', 'data');
            expect(res.data[0]).to.be.an('object').that.has.all.keys('item_name', 'data');
            expect(res.data[0].data).to.be.an('object').that.has.any.keys('price', 'volume', 'timestamp', 'change1day', 'change3day', 'change7day');
            done()
         });
    });

   it('test get trending list', function (done) {
      poporing.getTrendingList()
      .then(res => {
         expect(res.length).to.be.above(0)
         let sampleItem = res[0]
         expect(sampleItem).to.be.an('object').that.has.any.keys('name', 'display_name');
         done()
      })
   });

   it('test get item list', function (done) {
      poporing.getItemList()
      .then(data => {
         expect(data.item_list.length).to.be.above(0)
         expect(data.item_list[0]).to.be.an('object').that.has.any.keys('name', 'display_name', 'item_type', 'alt_display_name_list');
         done()
      })
   });

   it('test get all latest prices', function (done) {
      poporing.getAllLatestPrices()
      .then(res => {
         expect(res.length).to.be.above(0)
         expect(res[0]).to.be.an('object').that.has.all.keys('item_name', 'data');
         expect(res[0].data).to.be.an('object').that.has.any.keys('price', 'volume', 'timestamp', 'change1day', 'change3day', 'change7day');
         done()
      });
   })
    
});