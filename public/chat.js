var socket = io();

$('#chatroom form').submit(function() {
  var msg = $('#message')
  socket.emit('new message', msg.val());
  $('#messages').append($('<li>').text(`${socket.username}: ${msg.val()}`));
  msg.val('');
  return false;
});

socket.on('new message', function(message) {
  $('#messages').append($('<li>').text(message));
});

$('#signup form').submit(function() {
  var username = $('#nickname').val();
  socket.emit('add user', username);
  socket.username = username
  $('#signup').fadeOut();
  $('#chatroom').show();
  return false
});

socket.on('lonely', function() {
  $('#messages').append($('<li>').text("There are no other users in the queue yet. Waiting for someone to join..."));
});
