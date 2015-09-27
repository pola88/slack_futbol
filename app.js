require("babel/register");
var dotenv = require('dotenv');
dotenv.load();

if(!process.env.PBOT_APITOKEN) {
  throw new Error("Missing Api Token");
}

var port = process.env.PORT || 3001

require('./run').start( function(connection) {
  console.log("Gronpola is running");
});
