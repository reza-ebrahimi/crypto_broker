"use strict";

var express = require("express");
var controller = require("../controllers/controller");

var router = express.Router();

//router.route("/markets").get(controller.getMarkets);
router.route("/quote").post(controller.getQuote);

module.exports = router;
