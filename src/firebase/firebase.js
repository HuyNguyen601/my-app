import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: "AIzaSyBhInczMjUk2wKEe6rIDizZ019aXOz702E",
  authDomain: "golden-box-210702.firebaseapp.com",
  databaseURL: "https://golden-box-210702.firebaseio.com",
  projectId: "golden-box-210702",
  storageBucket: "golden-box-210702.appspot.com",
  messagingSenderId: "880826312165"
}

firebase.initializeApp(config);
const settings = {
  timestampsInSnapshots: true
};
const auth = firebase.auth();
const firestore = firebase.firestore();
firestore.settings(settings);
const database = firebase.database();

export {
  auth, firestore, database
};
