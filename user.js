var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/b03901095_Blog';
 
module.exports = {
    signup: function(name, email, password){
        MongoClient.connect(url, function(err, db) {
            const myDb = db.db('b03901095_Blog'); 
            myDb.collection('user').insertOne({
              "name": name,
              "email": email,
              "password": password
            },function(err, result){
                assert.equal(err, null);
                console.log("Saved the user sign up details.");
            });
        });
    },
    validateSignIn: function(username, password, callback){
        MongoClient.connect(url, function(err, db){
            const myDb = db.db('b03901095_Blog'); 
            myDb.collection('user').findOne({
              email : username,
              password: password, 
            },function(err, result){
                console.log("User signed in", result);
                if(result==null){
                    callback(false)
                }
                else{
                    callback(result)
                }
            });
        });
    }
}