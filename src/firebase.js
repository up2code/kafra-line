const admin = require('firebase-admin');
const axios = require('axios');
const cache = require('./cache');
const moment = require('moment');
// For local development
// var serviceAccount = require('./../serviceAccountKey.json');

// For host environment variable
const keysEnvVar = process.env['FIREBASE_ACCOUNT'];
if (!keysEnvVar) {
  throw new Error('The $FIREBASE_ACCOUNT environment variable was not found!');
}
var serviceAccount = JSON.parse(keysEnvVar);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "kafra-line.appspot.com"
});

var db = admin.firestore();

const mapEvent = event => {
  const mmStartDate = moment(event.start.toDate());
  const mmEndDate = moment(event.end.toDate());
  const mmToday = moment();
  const isRunning = mmToday.isBetween(mmStartDate, mmEndDate);
  return {
    name: event.name,
    description: event.description,
    startTime: mmStartDate.unix(),
    start: mmStartDate.format("LL"),
    end: mmEndDate.format("LL"),
    isEnded: mmToday.isAfter(mmEndDate),
    isRunning: mmToday.isBetween(mmStartDate, mmEndDate),
    fromNow: (isRunning)? "Happening now" : moment(event.start.toDate()).fromNow(),
    detailUrl: event.detailUrl,
    thumbUrl: (event.thumbUrl) ? event.thumbUrl : 'https://via.placeholder.com/800x600?text=EVENT'
  }
}

module.exports = {
    addRef: (name, value, type, description) => {

        if(!name) {
            return Promise.reject(new Error('Name is undefined'));
        }

        if(!value) {
            return Promise.reject(new Error('Value is undefined'));
        }

        if(!type) {
            return Promise.reject(new Error('Type is undefined'));
        }

        if(type != 'image' && type != 'url' && type != 'file') {
            return Promise.reject(new Error('Only url, image or file type are acceptable'));
        }

        return db.collection('ref').doc(name).set({
            name,
            type,
            value,
            description
        });
    },
    getAllCommand: () => {
        const key = 'firebase_get_all_command';

        return cache.get(key)
        .then(value => {
            if(value) {
                console.log('Cache [' + key + '] exists. Get all command from cache');
                return value;
            }

            console.log('Cache [' + key + '] not found. Get all command from firebase...');

            return db.collection('ref').get()
            .then((snapshot) => {
    
                let cmdList = [];
    
                snapshot.forEach((doc) => {
                    cmdList.push(doc.data());
                });

                console.log('Save cache [' + key + ']');
                cache.set(key, cmdList)
    
                return cmdList;
              })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        });
    },
    getAllEvents: () => {

        const key = 'firebase_get_all_events';

        return cache.get(key)
        .then(value => {
            if(value) {
                console.log('Cache [' + key + '] exists. Get all events from cache.');
                return value;
            }

            console.log('Cache [' + key + '] not found. Get all events from firebase.');

            return db.collection('events').get()
            .then((snapshot) => {
    
                let events = [];

                snapshot.forEach((doc) => {
                    events.push(mapEvent(doc.data()));
                });

                events = events.sort((a, b) => {
                    if(a.startTime < b.startTime) return -1;
                    if(a.startTime === b.startTime) return 0;
                    if(a.startTime > b.startTime) return 1;
                });

                console.log('Save cache [' + key + ']');
                cache.set(key, events)
    
                return events;
              })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        });
    },
    getCommand: name => {

        const key = 'firebase_get_command_' + name;

        return cache.get(key)
        .then(value => {
            if(value) {
                console.log('Cache [' + key + '] exists. Get command ' + name + ' from cache.');
                return value;
            }

            console.log('Cache [' + key + '] not found. Get command ' + name + ' from firebase.');

            return db.collection('ref').doc(name).get()
            .then(doc => doc.data())
            .then(data => {
                console.log('Save cache [' + key + ']');
                cache.set(key, data)
                return data;
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        });
    },
    getAllChat: () => {

        const key = 'firebase_get_all_chat';

        return cache.get(key)
        .then(value => {

            if(value) {
                console.log('Cache [' + key + '] exists. Get all chat from cache.');
                return value;
            }

            console.log('Cache [' + key + '] not found. Get all chat from firebase');

            return db.collection('chat').get()
            .then((snapshot) => {
                let list = [];
    
                snapshot.forEach((doc) => {
                    list.push(doc.data());
                });

                console.log('Save cache [' + key + ']');
                cache.set(key, list)
    
                return list;
              })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        });
    },
    downloadFile: filename => {
        return admin.storage().bucket().file(filename).download({
            destination: './ref/' + filename
        });
    }
}