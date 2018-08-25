require("babel-register");
// Include the logger module
var dotenv = require('dotenv');
if (process.env.NODE_ENV === 'prd') {
  dotenv.config({ path: '/home/ubuntu/bots/gronpola/.env'});
} else {
  dotenv.load();
}


if(!process.env.PBOT_APITOKEN) {
  throw new Error("Missing Api Token");
}

var port = process.env.PORT || 3001

require('./run').start( function(connection) {
  console.log("Gronpola is running");
});
