import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import Q from "q";
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
    let deferred = Q.defer();

    pgConnection.query("SELECT * FROM players WHERE team is not null;", (error, result) => {
      let players = result.rows;
      if(_.isEmpty(players)) {
        deferred.resolve(this._buildPayload("No hay ningun equipo todavia."));
        return;
      }

      let userIds = _.pluck(players, "user_id");

      Slack.getUsers(userIds)
         .then( userInfo => {
           let teamA = [];
           let teamB = [];
           let user;

           _.each(players, player => {
             user = _.find(userInfo, { id: player.user_id });
             if(player.team === "A") {
              teamA.push(user.name);
             } else {
              teamB.push(user.name);
             }
           });

           deferred.resolve(this._buildPayload(`Sol en la cara: ${teamA.join(", ")}, Sol en la nuca: ${teamB.join(", ")}` ));
         });
    });


    return deferred.promise;
  }
}
