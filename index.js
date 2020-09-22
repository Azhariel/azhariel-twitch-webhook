// Require express and body-parser
const express = require("express")
const dotenv = require('dotenv').config()

// Initialize express and define a port
const app = express()

// Tell express to use body-parser's JSON parsing
// app.use(bodyParser.json())
app.use(express.json())

// Tell express to use queryString parser
// app.set('query parser', (queryString) => {
//     return new URLSearchParams(queryString)
//   })

app.post("/", (req, res) => {
  console.log("[POST] recebido, respondendo com status 200.")
  console.log(req.body.data[0]['from_name'] + ' acabou de seguir ' + req.body.data[0]['to_name'])
  console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
  res.status(200).end() // Responding is important
})


app.get("/", (req, res) => {
  let challenge = req.query['hub.challenge']
  console.log("[GET] recebido, respondendo com status 200, challenge: "+challenge) // Call your action on the request here
  res.set('Content-Type', 'text/plain');
  res.send(challenge);
  res.status(200).end() // Responding is important
})


// Start express on the defined port
app.listen(dotenv.parsed.PORT, () => console.log(`Server running on port ${dotenv.parsed.PORT}`))


