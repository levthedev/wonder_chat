var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  socket.on('new message', function(msg) {
    io.emit('new message', `${socket.username}: ${msg}`);
  });

  socket.on('add user', function (username) {
    socket.username = username;
  });
});

http.listen(3000, function(){});
