import Connection from './lib/connection';
import request from "request-promise";
import cron from "./cron";

exports.start = function(callback) {
  let apiToken = process.env.PBOT_APITOKEN;
  let slackApi = process.env.SLACK_API;
  let authUrl = `${slackApi}/rtm.start?token=${apiToken}`;

  let connection;
  request(authUrl)
         .then( body => {
            let res = JSON.parse(body);
            if (res.ok) {
              connection = new Connection(res.url);

              cron.start(connection, function() {
                callback(connection);
              });
            }
          }, error => {
            console.log(error);
            return;
          });
}
