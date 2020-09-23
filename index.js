// Require express, dotenv & ws (websocket)
const express = require("express");
const dotenv = require("dotenv").config();
const ws = require("ws");
const evnts = require("events");
const path = require("path");
var event = new evnts.EventEmitter();


// !
// TODO: Pegar as variáveis recebidas no body (ver get.POST /hooks) e enviar em evento do websock
// ! 

// ? Não sei por quê o dotenv tá passando o .env só para .parsed ao invés de .process que nem na documentação, mas isso deve resolver?
dotenv.process = dotenv.parsed;

// Initialize express & websocket
const app = express();
const wsServer = new ws.Server({ noServer: true });

// Inicializa as variáveis de follow
let followFrom;
let followTo;

// * Quando um cliente conecta, cria um socket:
wsServer.on('connection', socket => {

   // * Envia para todos clientes conectados:
  socket.send('darkness');

  // * Quando recebe uma mensagem de (qualquer) cliente, loga:
  socket.on('message', message => console.log(message));

  // * Quando ocorre o gatilho websock, envia (para todos):
  event.on('websock', () => {
    socket.send('bang bang?');
  });

  // * Quando ocorre o gatilho followEvent, envia (para todos):
  event.on('followEvent', () => {
    socket.send(`${followFrom} acabou de seguir ${followTo}`)
  })
});



// Tell express to use JSON parsing
app.use(express.json());



// * POST em HOOKS
app.post("/hooks", (req, res) => {
  console.log("[POST] recebido, respondendo com status 200.");

  if (req.body.data[0]) {
    followFrom = req.body.data[0]["from_name"];
    followTo = req.body.data[0]["to_name"];
    console.log(
      followFrom + " acabou de seguir " + followTo
    );
    event.emit('followEvent');

    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    res.status(200).end(); // Responding is important
  } else {
    console.log("POST em /hooks sem follow data");
    res.status(200).end(); // Responding is important
  }
});

// * GET em WEBSOCKET
app.get("/websocket", (req, res) => {
  res.send('oi');

  // * Ativa o gatilho websock
  event.emit('websock');
});

// * GET em /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.get("/testWS.js", (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'testWS.js'));
});

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

// Inicia express na porta do .env ou na porta 41010
const server = app.listen(dotenv.process.PORT || 41010, () =>
  console.log(`Servidor iniciado na porta ${dotenv.process.PORT}`)
);

// Manipula a conexão a partir do pedido de upgrade
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});