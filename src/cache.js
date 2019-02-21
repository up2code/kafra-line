const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = {
    get: (key, callback) => {
        console.log('Try get ' + key + ' from cache');
        return myCache.get(key, callback);
    },
    set: (key, value) => {
        console.log('Try set ' + key + ' to cache');
        return myCache.set(key, value);
    }
}