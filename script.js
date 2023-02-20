// create WebRTC connection to other user
var otherUserIp = prompt('Enter the other user\'s IP address:');
var peerConnection = new RTCPeerConnection();
var dataChannel = peerConnection.createDataChannel('chat');
peerConnection.createOffer()
  .then(function(offer) {
    return peerConnection.setLocalDescription(offer);
  })
  .then(function() {
    alert('Please send this offer to the other user:\n\n' + JSON.stringify(peerConnection.localDescription));
    return new Promise(function(resolve) {
      peerConnection.onicecandidate = function(event) {
        if (event.candidate) return;
        resolve();
      };
    });
  })
  .then(function() {
    alert('Connection established!');
  });

// handle send button click
var sendButton = document.getElementById('send-button');
sendButton.onclick = function() {
  var input = document.getElementById('message-input');
  var message = input.value;
  if (message) {
    sendMessage(message);
    input.value = '';
  }
};

// send message to other user
function sendMessage(message) {
  dataChannel.send(message);
}

// add message to message list
function addMessage(message) {
  var messageList = document.getElementById('message-list');
  var li = document.createElement('li');
  li.textContent = message;
  messageList.appendChild(li);
}

// handle incoming messages
dataChannel.onmessage = function(event) {
  var message = event.data;
  addMessage(message);
};
