function parseDelay(msg) {
  delayed = msg.match(/\/delay \d+/);
  return delayed ? delayed[0].match(/\d+/)[0] : 0
}

function scrubMessage(msg) {
  var delayed = msg.match(/\/delay \d+/);
  return delayed ? msg.replace(delayed[0], '').trim() : msg
}

function append(message) {
  $('#messages').append($('<li>').text(message));
}

function checkForHop(message) {
  return message.substring(0, 5) == '/hop' ? true : false
}
