import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import _ from "lodash";
import Slack from "../models/slack";

export default class List extends Command {

  constructor(payload) {
    super(payload);
    this._name = "List";
  }

  static is(text) {
    let regExp = new RegExp(/.*(quienes|lista|jugadores).*/, "i");

    return regExp.test(text);
  }

  run() {
    let text = "";
    pgConnection.query("SELECT * FROM players ORDER BY created_at ASC;", async (error, result) => {
      let players = result.rows;
      if(_.isEmpty(players)) {
        this.bot.send(this.payload, this._buildPayload("Todos putos, nadie juega!!"));
        return;
      }
      let readyToPlay = _.slice(players, 0, 12);
      let waitingToPlay = _.slice(players, 12);

      let userNames = _.compact(_.map(readyToPlay, "user_name"));

      let userInfo = await Slack.getUsers(_.compact(_.map(readyToPlay, "user_id")));
      userNames = _.union(userNames, _.map(userInfo, "name"));

      if(waitingToPlay.length === 0) {
       text = `Por ahora somos ${userNames.length}: ${userNames.join(", ")}`;
     } else {
       let waitingToPlayInfo = await Slack.getUsers( _.compact(_.map(waitingToPlay, "user_id")));
       let userNamesWaiting = _.compact(_.map(waitingToPlay, "user_name"));

       let waitingToPlayNames = _.map(waitingToPlayInfo, "name");
       userNamesWaiting = _.union(userNamesWaiting, _.map(waitingToPlayNames, "name"));

       text = `Por ahora somos ${userNames.length}: ${userNames.join(", ")}\n En el banco: ${userNamesWaiting.join(", ")}`;
     }

     this.bot.send(this.payload, this._buildPayload(text));
    });
  }
}
