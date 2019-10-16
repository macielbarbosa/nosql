const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const generateNumber = () => Math.floor(Math.random() * 101);
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const documents = Array.from({length: 10/*00000*/}, () => ({
    val1: generateNumber(), val2: generateNumber()
  }))

  console.log(documents)
 
  //const db = client.db(dbName);
 
  /*insertDocuments(db, function() {
    
  });*/
  client.close();
});