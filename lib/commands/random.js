import Command from "./command";
import Q from "q";
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
    let deferred = Q.defer();

    pgConnection.query("SELECT * FROM players ORDER BY created_at ASC LIMIT 12;", (error, result) => {
      let players = result.rows;
      if(_.isEmpty(players)) {
        deferred.resolve(this._buildPayload("No hay jugadores, son todos putos!!"));
        return;
      } else if(players.length < 8) {
        deferred.resolve(this._buildPayload("Con la cantidad que son, jueguen al Fifa en la play, no molesten."));
        return;
      }

      let userIds = _.pluck(players, "user_id");

      Slack.getUsers(userIds)
         .then( userInfo => {
          let regExp = new RegExp(/(<@.*>\s?)/, "ig");
          let captainIds = regExp.exec(this.payload.text);
          let teamA = [];
          let teamB = [];
          let totalPlayers = userInfo.length;

          pgConnection.query(`UPDATE players SET captain = false;`, () => {
            if(captainIds) {
              captainIds = captainIds[0].replace(/<|@|>/g, "").split(" ");
              let removedPlayers = _.remove(userInfo, player => player.id === captainIds[0] || player.id === captainIds[1] );
              removedPlayers = _.shuffle(removedPlayers);

              removedPlayers.forEach( (player, index) => {
                if(index % 2 === 0) {
                  pgConnection.query(`UPDATE players SET team = 'A', captain = true where user_id = '${player.id}';`);
                  teamA.push(player);
                } else {
                  pgConnection.query(`UPDATE players SET team = 'B', captain = true where user_id = '${player.id}';`);
                  teamB.push(player);
                }
              });
            }

            let allPlayers = _.shuffle(userInfo);

            _.each(allPlayers, player => {
             if(teamA.length < totalPlayers / 2) {
               teamA.push(player);
             } else {
               teamB.push(player);
             }
            });

            let userIdsForQuery = _.map(_.pluck(teamA, "id"), (id) => `'${id}'`).join(",");
            pgConnection.query(`UPDATE players SET team = 'A' where user_id IN (${userIdsForQuery});`, () => {
             userIdsForQuery = _.map(_.pluck(teamB, "id"), (id) => `'${id}'`).join(",");
             pgConnection.query(`UPDATE players SET team = 'B' where user_id IN (${userIdsForQuery})`, () => {
              //  deferred.resolve(this._buildPayload(`Sol en la cara: ${_.pluck(teamA, "name").join(", ")}\nSol en la nuca: ${_.pluck(teamB, "name").join(", ")}` ));
               if(this.payload.telegram) {
                 deferred.resolve(this._buildPayload(`<b>Sol en la cara (Negra):</b>${_.pluck(teamA, "name").join(", ")}\n<b>Sol en la nuca(Blanca):</b>${_.pluck(teamB, "name").join(", ")}` ));
               } else {
                deferred.resolve(this._buildPayload(`*Sol en la cara* (#000000) ${_.pluck(teamA, "name").join(", ")}\n*Sol en la nuca* (#fafafa) ${_.pluck(teamB, "name").join(", ")}` ));
               }
             });
            });
          });
         });
    });

    return deferred.promise;
  }
}
