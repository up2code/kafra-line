const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = {
    get: key => {
        console.log('Try get ' + key + ' from cache');
        return new Promise(resolve => {
            myCache.get(key, resolve);
        });
    },
    set: (key, value) => {
        console.log('Try set ' + key + ' to cache');
        return myCache.set(key, value);
    }
}