import Slack from './lib/slack';
import request from "request-promise";
import cron from "./cron";
import Q from "q";
import TelegramBot from "node-telegram-bot-api";
import TelegramCommands from "./lib/telegram";
// import Slack from './lib/models/slack';
import Botkit from 'botkit'

let startSlack = function(callback) {
  let deferred = Q.defer();
  let apiToken = process.env.PBOT_APITOKEN;

  let controller = Botkit.slackbot({ send_via_rtm: true });

  let bot = controller.spawn({
    token: apiToken
  })

  let slackConnection;
  bot.startRTM( (err,bot,payload) => {
    if (err) {
      throw new Error('Could not connect to Slack');
    }

    slackConnection = new Slack(bot);

    cron.start(slackConnection, () => console.log("Cron started"));

    controller.on('direct_mention', (bot,message) => {
      slackConnection.incomingMessage(message);
    });

    controller.on('direct_message', (bot,message) => {
      slackConnection.incomingMessage(message);
    });
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
  startSlack();
  telegram();

  callback();
}
