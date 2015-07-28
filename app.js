require("babel/register");

var dotenv = require('dotenv');
dotenv.load();

if(!process.env.PBOT_APITOKEN) {
  throw new Error('Missing Api Token');
}

var run = require('./run').start();
