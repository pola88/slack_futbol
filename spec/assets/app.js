require("babel/register");
var express = require("express");
var path = require("path");
require("dotenv").config({path: path.join(__dirname, "../test_env") });

var app = express();

app.get("/api/users.info", function(req, res) {
  let userId = req.query.user;

  res.json({ ok: true, user: { name: userId } } );
});

exports.start = function(readyCallback) {
  app.listen(2999, function() {
    console.log("Express server listening on port %d in %s mode", 2999, app.settings.env);
    readyCallback();
  });
};
