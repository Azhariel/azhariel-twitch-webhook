// Require express and dotenv
const express = require("express");
const dotenv = require("dotenv").config();

// ? Não sei por quê o dotenv tá passando o .env só para .parsed ao invés de .process que nem na documentação, mas isso deve resolver?
dotenv.process = dotenv.parsed;

// Initialize express
const app = express();

// Tell express to use JSON parsing
app.use(express.json());

// Tell express to use queryString parser
// app.set('query parser', (queryString) => {
//     return new URLSearchParams(queryString)
//   })

app.post("/hooks", (req, res) => {
  console.log("[POST] recebido, respondendo com status 200.");

  if (req.body.data[0]) {
    console.log(
      req.body.data[0]["from_name"] +
        " acabou de seguir " +
        req.body.data[0]["to_name"]
    );

    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    res.status(200).end(); // Responding is important
  } else {
    console.log("POST em /hooks sem follow data");
    res.status(200).end(); // Responding is important
  }
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
app.listen(dotenv.process.PORT || 41010, () =>
  console.log(`Servidor iniciado na porta ${dotenv.process.PORT}`)
);
