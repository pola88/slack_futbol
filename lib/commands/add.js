import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import Q from "q";
import _ from "lodash";
import Slack from "../models/slack";

export default class Add extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Add";
    this._currentPromise = null;
  }

  static is(text) {
    let regExp = new RegExp(/.*(juego|juega).*/, "i");

    return regExp.test(text);
  }

  set currentPromise(promise) {
    this._currentPromise = promise;
  }

  get currentPromise() {
    return this._currentPromise;
  }

  // after(payload) {
  //   let deferred = Q.defer();
  //   let query = "SELECT * FROM players WHERE captain = true ORDER BY team ASC;";
  //
  //   pgConnection.query( query, (selectError, selectResult) => {
  //     let players = selectResult.rows;
  //     if(players.length === 2) {
  //       payload.text = `random <@${players[0].user_id}> <@${players[0].user_id}>`;
  //     } else {
  //       payload.text = "random";
  //     }
  //
  //     deferred.resolve(payload);
  //   });
  //
  //   return deferred.promise;
  // }

  _getUserId(text) {
    let regExp = new RegExp(/.*<@(.*)>.*/, "i");
    let userId = regExp.exec(text);

    if(!userId) {
      return this.currentPromise.resolve(this._buildPayload("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo."));
    }

    return userId[1];
  }

  another() {
    let userId = this._getUserId(this.payload.text);
    if(userId) {
      this._insert(userId);
    }
  }

  me() {
    this._insert(this.payload.user);
  }

  _insert(userId) {
    if(!userId) {
      return this.currentPromise.resolve(this._buildPayload("Me estas haciendo perder el tiempo, fijate lo que escribiste."));
    }

    let query = "SELECT * FROM players;";

    pgConnection.query( query, (error, result) => {
      let count = result.rows.length;
      let players = result.rows;

      if( +count === 12 ) {
        return this.currentPromise.resolve(this._buildPayload("Tarde!! Ya estamos los 12!! Pero todo tiene un precio :wink:"));
      }

      query = `SELECT * FROM players WHERE user_id = '${userId}';`;
      pgConnection.query( query, (selectError, selectResult) => {
        let player = selectResult.rows;
        if(!_.isEmpty(player)) {
          return this.currentPromise.resolve(this._buildPayload("Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?"));
        }

        query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('${userId}','now()','now()')`;

        pgConnection.query( query, () => {
          let playersIds = _.map(players, "user_id");
          playersIds.push(userId);
          Slack.getUsers(playersIds)
             .then( userInfo => {
               let userNames = _.pluck(userInfo, "name");
               this.currentPromise.resolve(this._buildPayload(`Que viva el futbol!!\nAhora somos ${userNames.length}:\n ${userNames.join("\n")}` ));
             });
        });
      });
    });
  }

  run() {
    let deferred = Q.defer();

    let regExp = new RegExp(/.*(juega).*/, "i");
    let anotherPlayer = regExp.test(this.payload.text);

    this.currentPromise = deferred;

    if(anotherPlayer) {
      this.another();
    } else {
      this.me();
    }

    return deferred.promise;
  }
}
