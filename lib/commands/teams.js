import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import _ from "lodash";
import Slack from "../models/slack";

export default class Teams extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Teams";
  }

  static is(text) {
    let regExp = new RegExp(/.*(equipos).*/, "i");

    return regExp.test(text);
  }

  run() {
    pgConnection.query("SELECT * FROM players WHERE team is not null;", async (error, result) => {
      let players = result.rows;
      if(_.isEmpty(players)) {
        this.bot.send(this.payload, this._buildPayload("No hay ningun equipo todavia."));
        return;
      }

      let userIds = _.map(players, "user_id");

      let userInfo = await Slack.getUsers(userIds);

      let teamA = [];
      let teamB = [];
      let user;

      _.each(players, player => {
       user = _.find(userInfo, { id: player.user_id });
       if(player.team === "A") {
        teamA.push(user ? user.name : player.user_name);
       } else {
        teamB.push(user ? user.name : player.user_name);
       }
      });

      let text = "";
      if(this.payload.telegram) {
       text = `<b>Sol en la cara (Negra):</b> ${teamA.join(", ")}\n<b>Sol en la nuca(Blanca):</b> ${teamB.join(", ")}`;
      } else {
       this.payload.mrkdwn = true;
       text = `*Sol en la cara* (#000000) ${teamA.join(", ")}\n*Sol en la nuca* (#fafafa) ${teamB.join(", ")}`;
      }

      this.bot.send(this.payload, this._buildPayload(text));
    });
  }
}
