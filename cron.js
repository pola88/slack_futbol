require("babel/register");
var CronJob = require('cron').CronJob;

exports.start = function(connection, callback) {
  var cleanJob = new CronJob({
    //Run once a day at midnight
    cronTime: '00 00 11 * * 1',
    onTick: function() {
      connection.sendCommand({ text: "start", channel: "C03CFASU7" });
    },
    start: false,
    timeZone: 'America/Argentina/Buenos_Aires'
  });

  callback();
}
