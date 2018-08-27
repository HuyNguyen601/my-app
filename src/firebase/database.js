import {db, database} from './firebase'
// db for firestore, database for realtime database
/*
export const initializeDatabase = (data)=> {
  data.forEach(element => {
    db.collection('Orders').add({
      orderID: element['Order ID'],
      date: typeof element['Order date'] !== 'undefined' ? element['Order date'] : '' ,
      sName: element['Sender Name'],
      sPhone: element['Sender Phone'],
      sAddress: element['Sender Address'],
      rName: element['Receiver Name'],
      rPhone: element['Receiver Phone'],
      rAddress: element['Receiver Address'],
      weight: element['Total Weight'],
      amount: element['Total Amount']
    }).then(function(docRef){
      console.log("Order written with ID: ",docRef.id);
    }).catch(function(error){
      console.log("Error adding order: ", error);
    });
  });
};*/

export const initializeTable = (changeRowValue) =>{
  database.ref().once('value').then(function(snapshot){
    const data = snapshot.val()
    const result = [];
    Object.keys(data).forEach(key => {
      result.push(data[''+key]);
    });
    changeRowValue(result);
  });
};
