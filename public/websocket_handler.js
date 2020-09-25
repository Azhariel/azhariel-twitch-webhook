const ws_url = 'wss://azhariel-twitch-webhook.herokuapp.com/' // ! local: 'ws://192.168.0.101:41010 ' 
let client = null;
let follower;

// * Função para conectar ao websocket
function connect_socket() {
    client = new WebSocket(ws_url);
    client.onclose = (event) => {
        connect_socket();
    }; // Ao fechar a conexão, executa a mesma função para abrir nova conexão
    client.onopen = (aberto) => {
        // Executa ping pela primeira vez
        client.send("cliente aberto");
        ping();
    }
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


// * Manipula as mensagens enviadas pelo servidor
client.onmessage = function(event) {
    var message = event.data;
    // Ignorar pongs enviados para manter a conexão ativa
    if (message != 'pong') {
        follower = JSON.parse(message);
        console.log(follower);
        document.getElementById('glitch').innerHTML = `<b>${follower.data[0]["from_name"]}</b>`;
        document.getElementById('glitch').setAttribute('data-text', follower.data[0]["from_name"]);

    }
};