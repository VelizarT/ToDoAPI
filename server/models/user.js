const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//create user schema
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {               //alternatively: validator: validator.isEmail will work
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

//methods turns methods into instance methods!
//overwrite a method so that only certain properties get sent back to the user
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

//adding instance methods / like adding to the prototype
UserSchema.methods.generateAuthToken = function () {
    var user = this; //arrow function do not have access to the this keyword
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    // user.tokens.push({access, token});
    user.tokens =  user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token; //this argument will be passes to the next success call
    });
};

//statics turns the added methods into model methods!
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => { //if the token is invalid -->error and we return rejected promise; alternatively - Promise.reject();
        //     reject();
        // });
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,    //quotes are neccessary when querying nested properties
        'tokens.access': 'auth'
    });
};

//Create user model: 
var User = mongoose.model('Users', UserSchema);

module.exports = {User};