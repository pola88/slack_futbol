require("babel/register");
var express = require("express");
var dotenv = require('dotenv');
dotenv.load();

var pgConnection = require("./lib/pg/connection");

if(!process.env.PBOT_APITOKEN) {
  throw new Error('Missing Api Token');
}

var app = express()
var port = process.env.PORT || 3000

app.get('/', function(req, res) {
  res.send("What's up?");
});

app.get('/status', function(req, res) {
  pgConnection.query('SELECT NOW() AS "theTime"', function(err, result) {
                if(err) {
                  error = { msg: 'error running query', error: err };

                  return res.status(422).json(error);
                }

                return res.status(200).json({ status: "ok" });
              });
});

app.listen(port);

var run = require('./run').start();
