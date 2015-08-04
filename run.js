import Connection from './lib/connection';
import request from "request-promise";

exports.start = function(callback) {
  let apiToken = process.env.PBOT_APITOKEN;
  let slackApi = process.env.SLACK_API;
  let authUrl = `${slackApi}/rtm.start?token=${apiToken}`;

  let connection;
  request(authUrl)
         .then( body => {
                let res = JSON.parse(body);
                if (res.ok) {
                  GLOBAL.__ID__ = 1;
                  connection = new Connection(res.url);

                  callback(connection);
                }
          }, error => {
            console.log(error);
            return;
          });
}
