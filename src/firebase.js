const admin = require('firebase-admin');
const fs = require('fs');

// For local development
// var serviceAccount = require('./../serviceAccountKey.json');

// For host environment variable
var serviceAccount = {
    "type": "service_account",
    "project_id": "kafra-line",
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT
}  


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
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
        return db.collection('ref').get()
        .then((snapshot) => {

            let cmdList = [];

            snapshot.forEach((doc) => {
                cmdList.push(doc.data());
            });

            return cmdList;
          })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    },
    getCommand: name => {
        return db.collection('ref').doc(name).get()
        .then(doc => doc.data())
        .catch((err) => {
            console.log('Error getting documents', err);
        });
    }
}