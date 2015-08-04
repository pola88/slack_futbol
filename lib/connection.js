import WebSocket from "ws";
import Command from "./command";
import Type from "./commands/type";
import _ from "lodash";

//<@U089DHV6J> bot
// channel: "C03CFASU7" //channel futbol
// channel: "D089GHK46" me
// channel: "U03C54WMF" me
export default class Connection {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.ws.on("open", () => {
      this.ws.on("message", (message) => this.incomingMessage(message) );
    });
  }

  open() {
    console.log("Connected");
  }

  send(payload) {
   let message = JSON.stringify(payload);
   console.log("Send: ", message);
   this.ws.send(message);
  }

  incomingMessage(payload) {
    console.log("Received: ", payload);
    payload = JSON.parse(payload);

    if(payload.type !== "message" || this.fromChannel(payload) || _.has(payload, "reply_to") || payload.user === "U089DHV6J") {
      return;
    }

    let command = Command.find(payload);
    if(!command) {
      return;
    }

    let typeCommand = new Type(payload);

    //remove the mention bot
    if(this.isForMe(payload.text)) {
      payload.text = payload.text.replace(/<@U089DHV6J>/gi, "");
    }

    this.send(typeCommand.payload);

    try {
      command.run()
             .then( result => {
                this.send(result);
             });
    } catch(e) {
      console.error("Error: ", e);
    }
  }

  close() {
    this.ws.close();
  }

  isForMe(text) {
    let regExp = new RegExp(/.*(<@U089DHV6J>).*/, "i");

    return regExp.test(text);
  }

  sendError(error) {
    let errorMessage = JSON.stringify(error);
    this.ws.send(JSON.stringify({ channel: "D089GHK46", text: errorMessage, type: "message" }));
  }

  fromChannel(payload) {
    return (payload.channel === "C03CFASU7" && !this.isForMe(payload.text));
  }

  sendCommand(payload) {
    let command = Command.find(payload);
    if(!command) {
      return;
    }

    let typeCommand = new Type(payload);

    this.send(typeCommand.payload);

    try {
      command.run()
             .then( result => {
                this.send(result);
             });
    } catch(e) {
      console.error("Error: ", e);
    }
  }
}
