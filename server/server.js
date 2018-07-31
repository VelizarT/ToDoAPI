require('./config/config');
const path = require('path');
const _ = require('lodash'); //utility functions 
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const {
    ObjectID
} = require('mongodb');

const {
    mongoose
} = require('./db/mongoose');
const {
    Todo
} = require('./models/todo');
const {
    User
} = require('./models/user');
const {
    authenticate
} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');


var app = express();
const port = process.env.PORT;

const pathPartials = path.join(__dirname, '/../views/partials');
hbs.registerPartials(pathPartials);
app.set('view engine', hbs);

const publicPath = path.join(__dirname, '../public');
app.use('/static', express.static(publicPath)); 
app.use(bodyParser.json());

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

app.get('/', (req, res) => {
    res.render('greeting.hbs', {
        title: "iDo App",
        signOptionOne: 'Log in',
        signOptionTwo: 'Sign up'
    });
});

app.get('/signup', (req, res) => {
    res.render('signup.hbs', {
        title: "SignUp | iDo",
        signOptionOne: 'Log in',
        signOptionTwo: 'Sign up'
    });
});

app.get('/login', (req, res) => {
    res.render('login.hbs', {
        title: "LogIn | iDo",
        signOptionOne: 'Log in',
        signOptionTwo: 'Sign up'
    });
});

app.get('/home', (req, res) => {
    res.render('home.hbs', {
        title: "Home | iDo",
        signOptionOne: 'Log out',
        signOptionTwo: 'Settings'
    });
});

app.get('/profile', (req, res) => {
    res.render('profile.hbs', {
        title: "Profile | iDo",
        signOptionOne: 'Log out',
        signOptionTwo: 'Settings'
    });
});

app.get('/new', (req, res) => {
    res.render('create-todo.hbs', {
        title: "New | iDo",
        signOptionOne: 'Log out',
        signOptionTwo: 'Settings'
    });
});

app.get('/todos/me', (req, res) => {
    res.render('todos.hbs', {
        title: "Your ToDos | iDo",
        signOptionOne: 'Log out',
        signOptionTwo: 'Settings'
    });
});

app.post('/todos', authenticate, async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        title: req.body.title,
        _creator: req.user._id
    });

    try {
        const doc = await todo.save();
        res.send(doc);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/todos', authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({
            _creator: req.user._id
        });
        res.send({
            todos
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

//GET /todos/someid; :id creates an id variable on the req object
//req.params is an object with key-value pairs: id:the passed id
app.get('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id; //all url params are stored
    //res.send(req.params);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    try {
        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({
            todo
        });
    } catch (err) {
        res.send(400).send();
    }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });

        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({
            todo
        });
    } catch (err) {
        res.status(400).send();
    }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'title','completed']); //pulls out properties specified in the array

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    try {
        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
            $set: body
        }, {
            new: true
        });
        if (!todo) {
            res.status(404).send();
        }
        res.send({
            todo
        });
    } catch (err) {
        res.status(400).send();
    }
});

//Sign up route
app.post('/users', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    //modle methods on User - findByToken
    //instance methods on user - generateAuthToken

    try {
        var chechUser = await User.findOne({email: body.email});
        if(!chechUser) {
            await user.save();
            const token = await user.generateAuthToken();
            res.header('x-auth', token).send(user); //send the token as a header; x stands for a custom header
        } else {
            res.status(400).send('Email is already registered');
        }
    } catch (err) {
        res.status(400).send('Username is required');
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//Sign in route
app.post('/users/login', async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    try {
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (err) {
        res.status(400).send();
    }
});

app.delete('/users/me', authenticate, async (req, res) => {

    try {
        const user = await User.findByIdAndRemove({
            _id: req.user._id
        });
        await Todo.find({
            _creator: user._id
        }).remove();
        res.status(200).send();
    } catch (err) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = {
    app
};