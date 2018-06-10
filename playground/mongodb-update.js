const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {

    if(err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to server');

    var db = client.db('ToDoApp');

    //first arg - filter; second arg - update to be made. The old version of the doc is returned as result
    //update using the update operators! $set - sets property; $inc - increases or decreases by amount, etc..
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b1aaf7275b1971e5198ed56')
    }, {
            $set: {
                name: 'Velizar'
            },
            $inc: {
                age: -3
            }
        }, {
            returnOriginal: false //When false, returns the updated document rather than the original. The default is true.
        }).then((result) => {
            console.log(result);
        });

    client.close()
});