require("babel-register");
var CronJob = require('cron').CronJob;

exports.start = function(connection, callback) {
  var cleanJob = new CronJob({
    //Run once a day at midnight
    cronTime: '00 00 10 * * 1',
    onTick: function() {
      connection.incomingMessage({ text: "start", channel: "C03CFASU7" });
    },
    start: false,
    timeZone: 'America/Argentina/Buenos_Aires'
  });

  cleanJob.start();
  callback();
}
