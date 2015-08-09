require("babel/register");
var express = require("express");
var dotenv = require('dotenv');
dotenv.load();

var pgConnection = require("./lib/pg/connection");

if(!process.env.PBOT_APITOKEN) {
  throw new Error("Missing Api Token");
}

var app = express()
var port = process.env.PORT || 3001

app.get("/", function(req, res) {
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

require('./run').start( function(connection) {
  app.post('/api/time', function(req, res) {
    connection.sendCommand({ text: "horario", channel: "C03CFASU7" })
    res.json(200, { status: "ok" });
  });

  app.post('/api/start', function(req, res) {
    connection.sendCommand({ text: "start", channel: "C03CFASU7" })
    res.json(200, { status: "ok" });
  });
});

app.listen(port);
