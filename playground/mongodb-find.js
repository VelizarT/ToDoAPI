const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => { //no need to create database first. Can start using it directly
    if(err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');
    const db = client.db('ToDoApp'); //get databese reference

    //find with no arg fetches all todos; returns cursos which is a pointer to the collection
    //toArray returns a promise
    //the object inside of find is the query
    // db.collection('Todos').find({
    //     _id: new ObjectID('5b1adfb0b4e1c853304ca911')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fatch todos', err);
    // }); 
  
    //cursor count method
    // db.collection('Todos').find().count().then((count) => {
    //     console.log('Todos count:', count);
    // }, (err) => {
    //     console.log('Unable to fatch todos', err);
    // }); 

    db.collection('Users').find({
        name: 'Velizar'
    }).toArray().then((users) => {
        console.log('Users:');
        console.log(JSON.stringify(users, undefined, 2));
    }, (err) => {
        console.log('Unable to fatch users', err);
    });
    
    //client.close();
}); 