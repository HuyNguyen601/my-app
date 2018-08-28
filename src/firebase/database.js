import {firestore, database} from './firebase'

//realtime database
export const addShipment= (data)=>{
  const shipmentNode = database.ref("/Shipments").push();
  const count = database.ref("/Count");
  count.once('value').then(function(snapshot){
    const id = snapshot.val().count+1;
    count.set({count: id});
    shipmentNode.set({id: id});
    shipmentNode.set({...data});
  });
}

export const initializeTable = (callback) =>{
  database.ref('/Shipments').once('value').then(function(snapshot){
    const data = snapshot.val()
    const result = [];
    Object.keys(data).forEach(key => {
      result.push(data[''+key]);
    });
    callback(result);
  });
}



//firestore
export const addUser = (user) => {
  const userDB = firestore.collection('Users');
  userDB.doc(user.phone).set({name: user.name, address: user.address});
};

export const getUser = (phone, callback) => {
  const docRef = firestore.collection('Users').doc(phone);
  docRef.get().then(function(doc){
    if(doc.exists)
      callback(doc.data());
  });
}
