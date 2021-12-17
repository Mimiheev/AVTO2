const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/CarRouter');

//Initiate our app
const app = express();
//config file upload
// app.use(cors());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// mongoo connect
const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
}

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose.connect(`mongodb+srv://admin:admin@cluster0.tc0de.mongodb.net/AVTO?retryWrites=true&w=majority`, options).then(()=>{
    console.log('MongoDB is connected')
    console.log('server worked')
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
    setTimeout(connectWithRetry, 5000)
  })
}

connectWithRetry()

//dev
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.text({limit: '50mb', extended: true}));

app.use('/api', router);

mongoose.set('debug', true);

module.exports = app;
