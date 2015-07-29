require("babel/register");
var express = require("express");
var dotenv = require('dotenv');
dotenv.load();

if(!process.env.PBOT_APITOKEN) {
  throw new Error('Missing Api Token');
}

var app = express()
var port = process.env.PORT || 3000

app.get('/', function(req, res) {
  res.send("What's up?");
});

app.listen(port);

var run = require('./run').start();
