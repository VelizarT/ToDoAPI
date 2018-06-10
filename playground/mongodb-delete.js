const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {

    if(err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongo server');
    var db = client.db('ToDoApp');

    //deleteMany - can provide callback, handle like promise or neither
    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    //deleteOne - deletes only the first doc
    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete - returns doc and deletes it
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result.value);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5b1cfe029f8b2669335cff02")}).then((result) => {
        console.log(result.value);
    });


    db.collection('Todos');

});