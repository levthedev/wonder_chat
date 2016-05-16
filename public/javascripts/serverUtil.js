var userQueue = []

module.exports.joinRoom = joinRoom;
module.exports.swapChatPeer = swapChatPeer;
module.exports.disbandChatRoom = disbandChatRoom;
module.exports.userQueue = userQueue;

function joinRoom(socket) {
  if (userQueue.length > 0) {
    assignPeers(socket);
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
  var oldPeer = socket.peer;
  joinRoom(socket);
  userQueue.push(oldPeer);
}

function disbandChatRoom(socket) {
  socket.leave(socket.room);
  socket.peer.leave(socket.peer.room);
  userQueue.push(socket);
  userQueue.push(socket.peer);
}
