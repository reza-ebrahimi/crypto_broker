"use strict";

var express = require("express");
var bodyParser = require("body-parser");

const settings = require("./settings");
var routes = require("./routes/routes");

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", routes);

app.listen(settings.port, () =>
  console.log("Listening on port " + settings.port)
);
