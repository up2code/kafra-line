const admin = require('firebase-admin');
const axios = require('axios');
const cache = require('./cache');
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
        .then((err, value) => {
            if(err) {
                console.log(err)
                return;
            }

            if(value) {
                console.log('Get all command from cache');
                return value;
            }

            console.log('Get all command from firebase');

            return db.collection('ref').get()
            .then((snapshot) => {
    
                let cmdList = [];
    
                snapshot.forEach((doc) => {
                    cmdList.push(doc.data());
                });

                cache.set(key, cmdList)
    
                return cmdList;
              })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        });
    },
    getCommand: name => {

        const key = 'firebase_get_command_' + name;

        return cache.get(key)
        .then((err, value) => {

            if(err) {
                console.log(err);
                return;
            }

            if(value) {
                console.log('Get command ' + name + ' from cache');
                return value;
            }

            console.log('Get command ' + name + ' from firebase');

            return db.collection('ref').doc(name).get()
            .then(doc => doc.data())
            .then(doc => {
                cache.set(key, doc.data())
                return doc.data();
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        });
    },
    getAllChat: () => {

        const key = 'firebase_get_all_chat';

        return cache.get(key)
        .then((err, value) => {
            if(err) {
                console.log(err)
                return;
            }

            if(value) {
                console.log('Get all chat from cache');
                return value;
            }

            console.log('Get all chat from firebase');

            return db.collection('chat').get()
            .then((snapshot) => {
                let list = [];
    
                snapshot.forEach((doc) => {
                    list.push(doc.data());
                });

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