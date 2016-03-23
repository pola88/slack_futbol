import Connection from './lib/connection';
import request from "request-promise";
import cron from "./cron";
import Q from "q";
import TelegramBot from "node-telegram-bot-api";
import TelegramCommands from "./lib/telegram";
import Slack from './lib/models/slack';

let slack = function(callback) {
  let deferred = Q.defer();
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
                deferred.resolve(connection);
              });
            }
          }, error => {
            console.error(error);
            deferred.reject(connection);
            return;
          });

  return deferred.promise;
};

let telegram = function() {
  let apiToken = process.env.TELEGRAM_KEY;

  // Setup polling way
  let bot = new TelegramBot(apiToken, {polling: true});
  let telegramCommands = new TelegramCommands(bot);

  bot.getMe().then(function (me) {
    console.log('Hi my name is %s!', me.username);
  });

  bot.onText(/(.+)/, (msg, match) => telegramCommands.incomingMessage(msg, match));

  bot.on('message', console.log);
};

exports.start = function(callback) {
  slack();
  telegram();

  callback();
}
