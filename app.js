const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const logger = require("morgan");

var app = express();

app.use(
  bodyParser.urlencoded({
    parameterLimit: 1000000,
    limit: "10mb",
    extended: true
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use(logger("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/api/", require("./app/Users/route"));

app.listen(8081, err => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log("Server is listening on PORT=",8081);
  }
})

module.exports = app;
