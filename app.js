require("babel/register");
// Include the logger module
var dotenv = require('dotenv');
dotenv.load();

if(!process.env.PBOT_APITOKEN) {
  throw new Error("Missing Api Token");
}

var port = process.env.PORT || 3001

require('./run').start( function(connection) {
  var winston = require('winston');
  // Set up log file. (you can also define size, rotation etc.)
  winston.add(winston.transports.File, { filename: './logs/app.log', datePattern: '.yyyy-MM-ddTHH-mm', maxFiles: 1, maxsize: 1024 });
  winston.handleExceptions(new winston.transports.File({
    filename: './logs/exceptions.log',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    maxFiles: 2,
    maxsize: 1024
  }));
  // Overwrite some of the build-in console functions
  console.error=winston.error;
  console.log=winston.info;
  console.info=winston.info;
  console.debug=winston.debug;
  console.warn=winston.warn;

  // console.log(__dirname);
  console.log("Gronpola is running");
});
