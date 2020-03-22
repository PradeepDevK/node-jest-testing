const app = require('./app');
const port = 8094;

console.log("Node version in use: " + process.version);
app.listen(8094, () =>
    console.log('Example app listening on port 8094!')
);