const express = require('express')
const app = express()
var bodyParser = require("body-parser");
const port = 3010
const con = require('./db')
const router = require("./app/routes/index.route");
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
router(app)

con.on("open", () => {
  console.log("Hello World");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
