// Requires
const express = require("express");
const dotenv = require("dotenv").config();
const ws = require("ws");
const evnts = require("events");
const path = require("path");
const event = new evnts.EventEmitter();


// Initialize express & websocket
const app = express();
const wsServer = new ws.Server({ noServer: true });

// * app.use - define middlewares para o Express
// Define a pasta "public" como pública para entrega de arquivos estáticos - .html, client-side .js, imagens etc.
app.use(express.static('public'));

// Define uso de parsing json
app.use(express.json());

// Inicializa as variáveis de follow - são definidas em app.post("/hooks")
let followFrom;
let followTo;
let follower; //JSON recebido no POST


// * Quando um cliente conecta, cria um socket:
wsServer.on('connection', socket => {

    /* // * Referência 
      // // Envia para o cliente conectado:
      // socket.send('Você está conectado via websocket!');
  
      // // Envia para todos OUTROS clientes:
      // wsServer.clients.forEach(function each(client){
        
      //   if (client !== socket && client.readyState === ws.OPEN) {
      //     client.send('Outro cliente conectado');
      //   }
        
      //});
      */

    // Quando recebe uma mensagem de (qualquer) cliente, loga:
    socket.on('message', message => console.log(message));

    // Ao receber a mensagem ping, envia a mensagem pong para o cliente que enviou
    socket.on('message', message => {
        if (message === 'ping') {
            socket.send('pong');
        }
    });

    // * Listeners de Eventos Emitidos *
    // * Ao referenciar socket no contexto de eventos, trata-se de todos sockets conectados *
    // Quando ocorre o gatilho websock, envia (para todos):
    event.on('websock', () => {
        // socket.send('Alguém acessou /websocket'); // Exemplo
    });

    // Quando ocorre o gatilho followEvent, envia (para todos):
    event.on('followEvent', () => {
        if (followFrom != 'Azhariel' && followTo === 'Azhariel') {
            socket.send(JSON.stringify(follower));
            // socket.send(`-= ${followFrom} acabou de seguir ${followTo} =-`)
        }
    })
});

// ! app.PROTOCOLO !
// * POST em HOOKS
app.post("/hooks", (req, res) => {
    console.log("[POST] recebido, respondendo com status 200.");

    // ? Caso o POST em HOOKS possua a estrutura de dados da twitch (dá pra melhorar isso, mas como?)
    if (req.body.data[0]) {
        follower = req.body;
        followFrom = req.body.data[0]["from_name"];
        followTo = req.body.data[0]["to_name"];
        console.log(
            `-= ${followFrom} acabou de seguir ${followTo} =-`
        );

        // * Emite o evento followEvent
        event.emit('followEvent');

        res.status(200).end(); // Responding is important
    } else { // Caso não possua a estrutura de dados da Twitch
        console.log("POST em /hooks sem follow data");
        res.status(200).end(); // Responding is important
    }
});

// * GET em HOOKS
app.get("/hooks", (req, res) => {
    if (req.query["hub.challenge"]) {
        let challenge = req.query["hub.challenge"];
        console.log(
            "[GET] recebido, respondendo com status 200, challenge: " + challenge
        ); // Call your action on the request here
        res.set("Content-Type", "text/plain");
        res.send(challenge);
        res.status(200).end(); // Responding is important
    } else {
        console.log("GET em /hooks sem Challenge");
        res.status(200).end();
    } // Responding is important
});

// * GET em WEBSOCKET
app.get("/websocket", (req, res) => {
    // Ativa o gatilho websock
    event.emit('websock');
    res.status(200).end();
});

// * GET em /
// ! removido pois se referia a arquivos estáticos servidos pelo app.use(express.static('public'));
/*
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, '/public', 'index.html'));
// });

// app.get("/testWS.js", (req, res) => {
//   res.sendFile(path.join(__dirname, '/public', 'testWS.js'));
// }); 
*/

// * Inicia express na porta do .env ou na porta 41010
const server = app.listen(process.env.PORT || 41010, () =>
    console.log(`Servidor iniciado na porta ${process.env.PORT}`)
);

// * Feito o pedido de upgrade para conexão websocket:
server.on('upgrade', (request, socket, head) => {
    // Manipula a conexão para o upgrade
    wsServer.handleUpgrade(request, socket, head, socket => {
        // * Emite o evento  "connection"
        wsServer.emit('connection', socket, request);
    });
});