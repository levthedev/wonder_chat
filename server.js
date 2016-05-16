var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('./public/javascripts/serverUtil');

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
    util.joinRoom(socket);
  });

  socket.on('hop', () => {
    if (util.userQueue.length > 0 && util.userQueue[0] != socket) {
      util.swapChatPeer(socket);
    } else if (util.userQueue[0] != socket) {
      util.disbandChatRoom(socket);
      socket.emit('lonely');
    }
  })
});

http.listen(process.env.PORT || 3000, () => {});
