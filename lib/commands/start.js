import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import Q from "q";
import _ from "lodash";
import phrasesJson from "../assets/phrases";

export default class Start extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Start";
  }

  static is(text) {
    let regExp = new RegExp(/.*(start).*/, "i");

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

      userIds = _.map(userIds, userId => { return `<@${userId}>`; } );

      let index = Math.floor(Math.random() * phrasesJson.phrases.length);

      if(userIds.length < 12) {
        deferred.resolve(this._buildPayload(`<!channel> "_${phrasesJson.phrases[index]}_", que viva el futbol!!! por ahora somos ${userIds.length}: ${userIds.join(", ")}. Se suma alguien? Alguien se baja?` ));
      } else {
        deferred.resolve(this._buildPayload(`<!channel> "_${phrasesJson.phrases[index]}_", que viva el futbol!!! ya estamos los 12: ${userIds.join(", ")}. si alguien se baja, avise...` ));
      }

    });


    return deferred.promise;
  }
}
