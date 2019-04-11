const romexchange = require('./../src/romexchange');
const chai = require('chai');
const expect = chai.expect;

describe('romexchange api test', function () {

    it('test get latest prices', function (done) {
        romexchange.getLatestPrices('cyfar')
         .then(data => {
            expect(data.length).to.be.above(0)
            expect(data[0]).to.be.an('object').that.has.any.keys('name', 'type', 'sea');
            expect(data[0].sea).to.be.an('object').that.has.all.keys('week', 'latest', 'latest_time');
            done()
         });
    });
    
});