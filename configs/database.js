//Import the mongoose module
var mongoose = require('mongoose');
const config = require('./configs')
var mongoDB = 'mongodb://' + config.DB_HOST + '/' + config.DB_NAME;
// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDB, { useNewUrlParser: true })
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = db