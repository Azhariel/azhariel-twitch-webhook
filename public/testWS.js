const client = new WebSocket('ws://192.168.0.101:41010'); //! Mudar para o endereço final 


client.onopen = (event) => {
    // Envia Hello para o servidor quando abrir a conexão
    client.send('Hello');
};

// Manipula as mensagens enviadas pelo servidor
client.onmessage = function (event) {
    console.log(event);
    var message = event.data;
    var messagesList = document.getElementById('messages');
    messagesList.innerHTML += '<li class="received">' + message + '</li>';
};