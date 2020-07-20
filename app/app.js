"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var cors = require("cors");
var app = express();
require("dotenv").config();

// Basic Configuration
var port = process.env.PORT || 3000;
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const urlObjSchema = new Schema({
  url : {type:String},
  shortUrl : {type:String}
});

const urlObj = mongoose.model("urlObj",urlObjSchema);



/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});








// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
