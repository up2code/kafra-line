const admin = require('firebase-admin');
const axios = require('axios');
const cache = require('./cache');
const moment = require('moment');
const romEvents = require('./rom.events');
const fs = require('fs');
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
    getNonWeeklyEvents: () => {

        const key = 'firebase_get_non_weekly_events';

        return cache.get(key)
        .then(value => {
            if(value) {
                console.log('Cache [' + key + '] exists. Get non weekly events from cache.');
                return value;
            }

            console.log('Cache [' + key + '] not found. Get non weekly events from firebase.');

            return db.collection('events').get()
            .then((snapshot) => {
    
                let events = [];

                snapshot.forEach((doc) => {
                    let event = doc.data();
                    if(!event.weekly) {
                        events.push(romEvents.mapEvent(event));
                    }
                });

                events = events.sort((a, b) => {
                    if(a.startTime < b.startTime) return -1;
                    if(a.startTime === b.startTime) return 0;
                    if(a.startTime > b.startTime) return 1;
                });

                console.log(events)

                console.log('Save cache [' + key + ']');
                cache.set(key, events)
    
                return events;
              })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        });
    },
    getWeeklyEvents: () => {

        const key = 'firebase_get_weekly_events';

        return cache.get(key)
        .then(value => {
            if(value) {
                console.log('Cache [' + key + '] exists. Get Weekly events from cache.');
                return value;
            }

            console.log('Cache [' + key + '] not found. Get Weekly events from firebase.');

            return db.collection('events').get()
            .then((snapshot) => {
    
                let events = [];

                snapshot.forEach((doc) => {
                    let event = doc.data();
                    if(event.weekly) {
                        events.push(romEvents.mapWeeklyEvent(event));
                    }
                });

                events = events.sort((a, b) => {
                    if(a.startTime < b.startTime) return -1;
                    if(a.startTime === b.startTime) return 0;
                    if(a.startTime > b.startTime) return 1;
                });

                console.log(events)

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
    getAppConfig: () => {

        const key = 'firebase_get_app_config';

        return cache.get(key)
        .then(value => {

            if(value) {
                console.log('Cache [' + key + '] exists. Get config from cache.');
                return value;
            }

            console.log('Cache [' + key + '] not found. Get config from firebase');

            return db.collection('app').get()
            .then((snapshot) => {

                let appConfig = {}
                snapshot.docs.forEach((doc) => {
                    appConfig[doc.id] = doc.data();
                })

                const destinationConfigFile = `${__dirname}/../global_config.json`;
                
                fs.writeFile(destinationConfigFile, JSON.stringify(appConfig),{encoding:'utf8',flag:'w'}, err => {
                    if(err) {
                        console.log(`Failed to write config json file from firebase to ${destinationConfigFile}`);
                        console.error(err);
                    } else {
                        console.log(`config updated! (${destinationConfigFile})`);
                    }
                });
    
                return appConfig;
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