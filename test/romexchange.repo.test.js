const romexchangeRepo = require('./../src/romexchange.repo');
const chai = require('chai');
const expect = chai.expect;

describe('romexchange repo test', function () {

    it('test get latest price', function (done) {
        romexchangeRepo.getLatestPrices("cyfar")
        .then(result => {
          console.log(result)
          expect(result.length).to.be.above(0)
          expect(result[0]).to.be.an('object').to.include.all.keys('name', 'display_name', 'priceData');
          expect(result[0].priceData).to.be.an('object').to.include.all.keys('price', 'latest_time');
          done();
        })
    });
    
});