import {firestore, database, storage} from './firebase'

//realtime database
export const addShipment = (data) => {
  const shipmentNode = database.ref("/Shipments").push();
  const count = database.ref("/Count");
  count.once('value').then(function(snapshot) {
    const id = snapshot.val().count + 1;
    count.set({count: id});
    data.id = id;
    shipmentNode.set({
      ...data
    });
  });
}

export const updateShipment = (data,id) => {
  database.ref('/Shipments/'+id).set({...data});
}

export const getShipment = (key, callback) => {
  database.ref('/Shipments/' + key).once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
}

export const initializeTable = (callback) => {
  database.ref('/Shipments').once('value').then(function(snapshot) {
    const data = snapshot.val()
    const result = [];
    if (data === null)
      return 0;
    else {
      Object.keys(data).forEach(key => {
        const obj = data[key];
        obj.link = key;
        result.push(obj);
      });
    }
    callback(result);
  });
}
//storageBucket
export const uploadFile = (file, id) => {
  const ref = storage.ref('/'+id+'/picture');
  ref.put(file).then(alert('File Uploaded')).catch(function(error){alert('Error: '+error);});
}

export const downloadFile = (id, callback) => {
  const ref = storage.ref('/'+id+'/picture');
  ref.getDownloadURL().then(callback);
}

//firestore
export const addUser = (user) => {
  const userDB = firestore.collection('Users');
  userDB.doc(user.phone).set({name: user.name, address: user.address});
};

export const getUser = (phone, callback) => {
  const docRef = firestore.collection('Users').doc(phone);
  docRef.get().then(function(doc) {
    if (doc.exists)
      callback(doc.data());
    }
  );
}
