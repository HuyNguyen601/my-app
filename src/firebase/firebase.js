import firebase from 'firebase'
import 'firebase/auth'

const config = {
  apiKey: "AIzaSyBhInczMjUk2wKEe6rIDizZ019aXOz702E",
  authDomain: "golden-box-210702.firebaseapp.com",
  databaseURL: "https://golden-box-210702.firebaseio.com",
  projectId: "golden-box-210702",
  storageBucket: "golden-box-210702.appspot.com",
  messagingSenderId: "880826312165"
}

firebase.initializeApp(config);
const auth = firebase.auth();
export {
  auth,
};
