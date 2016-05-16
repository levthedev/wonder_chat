var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var userQueue = []

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('new message', function(msg) {
    io.in(socket.room).emit('add message', `${socket.username}: ${msg}`);
  });

  socket.on('add user', (username) => {
    socket.username = username;
    joinRoom(socket);
  });

  socket.on('hop', () => {
    if (userQueue.length > 0 && userQueue[0] != socket) {
      console.log(socket.username)
      console.log(userQueue.map((u)=>{u.username}))
      swapChatPeer(socket);
    } else if (userQueue[0] != socket) {
      socket.leave(socket.room);
      socket.peer.leave(socket.peer.room);
      userQueue.push(socket);
      userQueue.push(socket.peer);
    }
  })
});

function joinRoom(socket) {
  if (userQueue.length > 0) {
    assignPeers(socket);
    io.in(room).emit('new room');
  } else {
    userQueue.push(socket);
    socket.emit('lonely');
  }
}

function assignPeers(socket) {
  var peer = userQueue.shift();
  var room = socket.username + '#' + peer.username;

  peer.join(room);
  socket.join(room);

  socket.peer = peer;
  peer.peer = socket;
  socket.room = room;
  peer.room = room;
}

function swapChatPeer(socket) {
  socket.leave(socket.room);
  socket.peer.leave(socket.room);
  var oldPeer = socket.peer
  joinRoom(socket);
  userQueue.push(oldPeer);
}

http.listen(3000, () => {});
