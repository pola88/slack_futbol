import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import Q from "q";
import _ from "lodash";
import request from "request-promise";

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
      }

      let userIds = _.pluck(players, "user_id");

      this._getUserNames(userIds)
          .then( userNames => {
            // userIds = _.map(userIds, userId => { return `<@${userId}>`; } );
            deferred.resolve(this._buildPayload("Por ahora los q juegan son: " + userNames.join(", ") ));
          });
    });


    return deferred.promise;
  }

  _getUserNames(userIds) {
    let deferred = Q.defer();
    let apiToken = process.env.PBOT_APITOKEN;
    let slackApi = process.env.SLACK_API;
    let allRequests = [];

    userIds.forEach( userId => {
      let userUrl = `${slackApi}/users.info?token=${apiToken}&user=${userId}`;
      allRequests.push(request(userUrl));
    });

    Q.all(allRequests)
     .then( response => {
       let users = _.map( response, body => {
         return JSON.parse(body).user;
       });

       let userNames = _.pluck(users, "name");

       deferred.resolve(userNames);
     });

    return deferred.promise;
  }
}
