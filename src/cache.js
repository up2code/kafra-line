const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = {
    get: key => {
        console.log('Try get ' + key + ' from cache');
        return new Promise((resolve, reject) => {
            myCache.get(key, (err, value) => {
                resolve(err,value);
            });
        });
    },
    set: (key, value) => {
        console.log('Try set ' + key + ' to cache');

        return new Promise((resolve,reject) => {
            myCache.set(key, value, (err, success) => {
                if(err) {
                    console.error(err)
                    reject(err);
                } else {
                    resolve(success);
                }
            });
        });
    }
}