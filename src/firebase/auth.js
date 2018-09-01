import { auth } from './firebase'

// Sign In
export const checkAuthentication = (email, password, success, error) => auth.setPersistence(auth.Auth.Persistence.SESSION)
.then(function(email, password){
  return auth.signInWithEmailAndPassword(email, password);
}).then(success).catch(error);

export const watchChange  = (callback) => auth.onAuthStateChanged(function(user){
  callback(user);
});

export const getUser = ()=>auth.getCurrentUser;
