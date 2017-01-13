import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import Q from "q";
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
    let deferred = Q.defer();

    pgConnection.query("SELECT * FROM players ORDER BY created_at ASC;", (error, result) => {
      let players = result.rows;
      if(_.isEmpty(players)) {
        deferred.resolve(this._buildPayload("Todos putos, nadie juega!!"));
        return;
      }

      let userIds = _.pluck(players, "user_id");

      let firstTeamPlayer = _.slice(userIds, 0, 12);
      let waitingToPlay = _.slice(userIds, 12);

      Slack.getUsers(firstTeamPlayer)
         .then( userInfo => {
           let userNames = _.pluck(userInfo, "name");
           if(waitingToPlay.length === 0) {
             return deferred.resolve(this._buildPayload(`Por ahora somos ${userNames.length}: ${userNames.join(", ")}` ));
           }

           Slack.getUsers(waitingToPlay)
              .then( waitingToPlayInfo => {
                let waitingToPlayNames = _.pluck(waitingToPlayInfo, "name");
                deferred.resolve(this._buildPayload(`Por ahora somos ${userNames.length}: ${userNames.join(", ")}\n En el banco: ${waitingToPlayNames.join(", ")}` ));
              });
         });
    });


    return deferred.promise;
  }
}
