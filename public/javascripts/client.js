var socket = io();

$('#signup form').submit(() => {
  var username = $('#nickname').val();
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
  var lonelyMessage = 'There are no other users in the queue. Waiting for someone to join...';
  append(lonelyMessage);
});
