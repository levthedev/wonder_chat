var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var userQueue = []
var rooms = {}

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  joinRoom(socket);

  socket.on('new message', function(msg) {
    var room = rooms[socket.id];
    socket.broadcast.to(room).emit('new message', `${socket.username}: ${msg}`);
  });

  socket.on('add user', function (username) {
    socket.username = username;
  });
});

function joinRoom(socket) {
  if (userQueue.length > 0) {
    var peer = userQueue.pop();
    var room = socket.id + '#' + peer.id

    peer.join(room);
    socket.join(room);

    rooms[peer.id] = room;
    rooms[socket.id] = room;
  } else {
    userQueue.push(socket);
  }
}

http.listen(3000, function(){});
