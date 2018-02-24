import Command from "./command";
import request from "request-promise";

//<@U089DHV6J> bot
// channel: "C03CFASU7" #futbol
// channel: "D089GHK46" me
// channel: "U03C54WMF" me
// C02TUBDTJ #general
export default class Slack {
  constructor(bot) {
    this.command = new Command(false);
    this.bot = bot;
  }

  replyWithTyping(payload, result) {
    this.bot.replyWithTyping(payload, result.text);
  }

  incomingMessage(payload) {
    console.log("Received: ", payload);
    if(payload.channel === "C02TUBDTJ") {
      return;
    }

    let command = this.command.find(payload);
    if(!command) {
      return;
    }

    command.slack = this;


    try {
      command.run();
      // command.run()
      //        .then( result => {
      //           this.bot.replyWithTyping(payload, result.text);
      //           if(command.after) {
      //             command.after(payload)
      //                    .then( newPayload => {
      //                      this.incomingMessage(newPayload);
      //                    });
      //           }
      //        });
    } catch(e) {
      console.error("Error: ", e);
    }
  }

  sendCommand(payload) {
    console.log("Sending: ", payload);
    let command = this.command.find(payload);
    if(!command) {
      return;
    }

    try {
      command.run()
             .then( result => {
                this.bot.replyWithTyping(payload, result.text);
             });
    } catch(e) {
      console.error("Error: ", e);
    }
  }

  //TODO: add this to remove command
  checkForRemove(payload) {
    let command = this.command.findToRemove(payload);
    if(!command) {
      return;
    }

    let apiToken = process.env.PBOT_APITOKEN;
    let slackApi = process.env.SLACK_API;

    let deleteMessage = `${slackApi}/chat.delete?token=${apiToken}&ts=${payload.ts}&channel=C03CFASU7`;
    request(deleteMessage);
  }
}
