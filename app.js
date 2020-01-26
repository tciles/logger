const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const DefaultController = require('./Controller/DefaultController');
const defaultController = new DefaultController(io);

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname + '/public')));

// Define routes.
app.use(defaultController.getRouter());

http.listen(3000, function() {
   console.log(`Listening *:3000`);
});
