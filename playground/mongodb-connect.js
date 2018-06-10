// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //same as above but can pull more stuff out of mongodb

// var user = {
//     name: 'Velizar',
//     age: 25
// };

// var obj = new ObjectID(); //create new unique objId
// console.log(obj);

// var {name} = user; //ES6 object destructure - make a var and pull out property value


MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => { //no need to create database first. Can start using it directly
    if(err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');
    const db = client.db('ToDoApp'); //get databese reference

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unbale to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2)); //result.ops all inserts

    // });

    // db.collection('Users').insertOne({
    //     name: 'Velizar', 
    //     age: 25,
    //     location: 'Sofia'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unbale to insert todo', err);
    //     }
    //     console.log(result.ops[0]._id.getTimestamp()); //result.ops all inserts
    // })

    // client.close();
}); 
//first arg is the url, sec - callback
