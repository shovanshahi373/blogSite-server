const firebase = require("firebase/app");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
require("dotenv").config();
const bucket = process.env.STORAGE_BUCKET;
const allPokemon = require("../completePokeInfo.json");
require("firebase/firestore");
const admin = require("firebase-admin");
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSENGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: path.resolve(__dirname, "../pokedex-sa.json"),
});

firebase.initializeApp(config);
const fStore = firebase.firestore();
const myBucket = storage.bucket(process.env.STORAGE_BUCKET);

module.exports = {
  firebase,
  fStore,
  myBucket,
  admin,
};
