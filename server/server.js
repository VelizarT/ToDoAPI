require('./config/config');

const _ = require('lodash'); //utility functions 
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    var todos = Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

//GET /todos/someid; :id creates an id variable on the req object
//req.params is an object with key-value pairs: id:the passed id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id; //all url params are stored
    //res.send(req.params);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }, (err) => {
        res.send(400).send();
    })
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //pulls out properties specified in the array

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            res.send(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    //modle methods on User - findByToken
    //instance methods on user - generateAuthToken

    user.save().then(() => {
        return user.generateAuthToken();
        // res.send(user);
    }).then((token) => {
        res.header('x-auth', token).send(user); //send the token as a header; x stands for a custom header
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = {app};
