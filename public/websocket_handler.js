const ws_url = 'wss://azhariel-twitch-webhook.herokuapp.com/' // ! 'ws://192.168.0.101:41010' // !
let client = null;


// * Função para conectar ao websocket
function connect_socket() {
    client = new WebSocket(ws_url);
    client.onclose = (event) => {
        connect_socket();
    }; // Ao fechar a conexão, executa a mesma função para abrir nova conexão
    client.onopen = (aberto) => {
        client.send("cliente aberto");
        ping();
    }
     // Executa ping pela primeira vez
}

// * Função para enviar ping ao servidor a cada 20s
function ping() {
    if (!client) return; // Caso não haja socket;
    if (client.readyState !== 1) return; // Caso o estado seja diferente de 1 (conectado)
    client.send("ping");
    setTimeout(ping, 20000); // Chama a função a cada 20s
}

// * Conexão inicial
connect_socket();


// Manipula as mensagens enviadas pelo servidor
client.onmessage = function (event) {
    console.log(event);
    var message = event.data;
    var messagesList = document.getElementById('messages');
    messagesList.innerHTML += '<li class="received">' + message + '</li>';
};