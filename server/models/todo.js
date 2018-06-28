var mongoose = require('mongoose');

//Create/configure todo model: 
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean   ,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId, // set type to be ObjectId
        required: true,
    }
});

module.exports = {Todo};