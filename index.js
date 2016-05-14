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
    io.in(room).emit('add message', `${socket.username}: ${msg}`);
  });

  socket.on('add user', function (username) {
    socket.username = username;
  });

  socket.on('hop', function() {
    joinRoom(socket);
  })
});

function joinRoom(socket) {
  if (userQueue.length > 0) {
    var peer = userQueue.pop();
    var room = socket.id + '#' + peer.id;

    peer.join(room);
    socket.join(room);

    rooms[peer.id] = room;
    rooms[socket.id] = room;
  } else {
    userQueue.push(socket);
    socket.rooms.map(function(room) {
      socket.leave(room)
    })
    socket.emit('lonely');
  }
}

http.listen(3000, function(){});
