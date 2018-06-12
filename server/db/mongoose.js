const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //specifies that we use the buil-in promises, not a library
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};

//process.env.NODE_ENV - environment; 'production' by default in heroku; 'development' for local database and 'test' for testing