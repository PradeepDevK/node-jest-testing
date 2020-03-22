const mongoose = require('mongoose');
const appConfig = require('../config/app_config.js');

const mongoURI_One = appConfig.mongoDB.mongoDBURI_One; //connecting to Corporate
const options = {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true
};

mongoose.connect(mongoURI_One, options);

mongoose.connection.on('connected', (err) => {
    console.log('Mongoose default connection open to ' + mongoURI_One);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log('handle mongo errored connections: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', (err) => {
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
    mongoose.connection.close((err) => {
        console.log('App terminated, closing mongo connections');
        process.exit(0);
    });
});