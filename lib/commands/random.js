import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import _ from "lodash";
import Slack from "../models/slack";

export default class Random extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Random";
  }

  static is(text) {
    let regExp = new RegExp(/.*(random).*/, "i");

    return regExp.test(text);
  }

  run() {
    pgConnection.query("SELECT * FROM players ORDER BY created_at ASC LIMIT 12;", (error, result) => {
      let players = result.rows;

      if(_.isEmpty(players)) {
        this.bot.send(this.payload, this._buildPayload("No hay jugadores, son todos putos!!"));
        return;
      } else if(players.length < 8) {
        this.bot.send(this.payload, this._buildPayload("Con la cantidad que son, jueguen al Fifa en la play, no molesten."));
        return;
      }

      let teamA = [];
      let teamB = [];
      let totalPlayers = players.length;

      pgConnection.query(`UPDATE players SET captain = false;`, () => {
        let allPlayers = _.shuffle(players);

        _.each(allPlayers, player => {
         if(teamA.length < totalPlayers / 2) {
           teamA.push(player);
         } else {
           teamB.push(player);
         }
        });

        let userIdsForQuery = _.map(_.map(teamA, "id"), (id) => `'${id}'`).join(",");
        pgConnection.query(`UPDATE players SET team = 'A' where id IN (${userIdsForQuery});`, () => {
         userIdsForQuery = _.map(_.map(teamB, "id"), (id) => `'${id}'`).join(",");
         pgConnection.query(`UPDATE players SET team = 'B' where id IN (${userIdsForQuery})`, async () => {
           let teamAUserIds = _.compact(_.map(teamA, "user_id"));
           let userAInfo = await Slack.getUsers(teamAUserIds);
           let teamANames = _.compact(_.union(_.map(userAInfo, "name"), _.map(teamA, "user_name")));

           let teamBUserIds = _.compact(_.map(teamB, "user_id"));
           let userBInfo = await Slack.getUsers(teamBUserIds);
           let teamBNames = _.compact(_.union(_.map(userBInfo, "name"), _.map(teamB, "user_name")));

           if(this.payload.telegram) {
             // deferred.resolve(this._buildPayload(`<b>Sol en la cara (Negra):</b>${teamANames.join(", ")}\n<b>Sol en la nuca(Blanca):</b>${teamBNames.join(", ")}` ));
           } else {
             this.bot.send(this.payload, this._buildPayload(`*Sol en la cara* (#000000) ${teamANames.join(", ")}\n*Sol en la nuca* (#fafafa) ${teamBNames.join(", ")}`));
           }
         });
        });
      });
    });
  }
}
