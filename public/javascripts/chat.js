var socket = io();

$('#signup form').submit(() => {
  var username = $('#nickname').val();
  socket.username = username;
  socket.emit('add user', username);
  $('#signup').fadeOut();
  $('#chatroom').show();
  return false;
});

$('#chatroom form').submit(() => {
  var msg = $('#message').val();
  if (checkForHop(msg)) {
    socket.emit('hop')
  } else {
    socket.emit('new message', msg);
  };
  $('#message').val('');
  return false;
});

socket.on('add message', (message) => {
  delay = parseDelay(message);
  scrubbedMessage = scrubMessage(message);
  setTimeout(function() {
    append(scrubbedMessage);
  }, delay);
});

socket.on('lonely', () => {
  var lonelyMessage = "There are no other users in the queue yet. Waiting for someone to join...";
  append(lonelyMessage);
});

// socket.on('new room', () => {
//   append(`${socket.peer.username.toUpperCase()} joined the room`);
// })
