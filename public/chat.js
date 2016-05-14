var socket = io();

$('#chatroom form').submit(function() {
  var msg = $('#message');
  socket.emit('new message', msg.val());
  msg.val('');
  return false;
});

socket.on('add message', function(message) {
  delay = parseDelay(message);
  scrubbedMessage = scrubMessage(message);
  setTimeout(function() {
    $('#messages').append($('<li>').text(scrubbedMessage));
  }, delay);
});

$('#signup form').submit(function() {
  var username = $('#nickname').val();
  socket.emit('add user', username);
  socket.username = username;
  $('#signup').fadeOut();
  $('#chatroom').show();
  return false;
});

socket.on('lonely', function() {
  $('#messages').append($('<li>').text("There are no other users in the queue yet. Waiting for someone to join..."));
});

function parseDelay(msg) {
  var _delay;
  delay_command = msg.match(/\/delay \d+/);
  if (delay_command) {
    _delay = delay_command[0].match(/\d+/)[0];
  } else {
    _delay = 0;
  }
  return _delay;
}

function scrubMessage(msg) {
  if (msg.match(/\/delay \d+/)) {
    return msg.replace(msg.match(/\/delay \d+/)[0], '').trim();
  } else if (msg.match(/\/hop/)) {
    socket.emit('hop')
  } else {
    return msg;
  }
}
