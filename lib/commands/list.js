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

    pgConnection.query("SELECT * FROM players", (error, result) => {
      let players = result.rows;
      if(_.isEmpty(players)) {
        deferred.resolve(this._buildPayload("Todos putos, nadie juega!!"));
        return;
      }

      let userIds = _.pluck(players, "user_id");

      Slack.getUsers(userIds)
         .then( userInfo => {
           let userNames = _.pluck(userInfo, "name");

           deferred.resolve(this._buildPayload(`Por ahora somos ${userNames.length}:\n${userNames.join("\n")}` ));
         });
    });


    return deferred.promise;
  }
}
