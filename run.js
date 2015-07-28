import Slack from 'node-slack-upload';
import Connection from './connection';
import request from "request";
import pgConnection from "./lib/pg/connection";

exports.start = function() {
  let apiToken = process.env.PBOT_APITOKEN;
  let authUrl = "https://slack.com/api/rtm.start?token=" + apiToken;

  // let slack = new Slack(apiToken);
  let connection;
  request(authUrl, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      let res = JSON.parse(body);
      if (res.ok) {
        connection = new Connection(res.url);
      }
    }
  });
}
