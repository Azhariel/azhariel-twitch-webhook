const client = new WebSocket('ws://192.168.0.101:41010'); //! Mudar para o endereço final 


client.onopen = (event) => {
    // Causes the server to print "Hello"
    client.send('Hello');
};

// Handle messages sent by the server.
client.onmessage = function (event) {
    var message = event.data;
    var messagesList = document.getElementById('messages');
    messagesList.innerHTML += '<li class="received">' + message + '</li>';
};