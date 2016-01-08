import Command from "../command";
import Q from "q";
import _ from "lodash";
import Slack from "../../models/slack";
import pgConnection from "../../../lib/pg/connection";

export default class Add extends Command {

  constructor(payload) {
    super(payload);
    this._name = "IAm";
  }

  static is(text) {
    let regExp = new RegExp(/.*(soy).*/, "i");

    return regExp.test(text);
  }

  _getUserName() {
    let text = this.payload.text;
    let regExp = new RegExp(/soy (.*)+/, "i");
    let userName = regExp.exec(text);

    if(!userName) {
      return this.currentPromise.resolve(this._buildPayload("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo."));
    }

    return userName[1];
  }

  _insert(userId) {
    if(!userId) {
      return this.currentPromise.resolve(this._buildPayload("Me estas haciendo perder el tiempo, fijate lo que escribiste."));
    }

    let query = `SELECT * FROM users WHERE user_id = '${userId}';`;
    pgConnection.query( query, (selectError, selectResult) => {
      let user = selectResult.rows;
      if(!_.isEmpty(user)) {
        return this.currentPromise.resolve(this._buildPayload("Ya estas registrado, si no fuiste vos, te cagaron."));
      }

      let telegramId = this.payload.from.id;
      query = `SELECT * FROM users WHERE telegram_id = '${telegramId}';`;
      pgConnection.query( query, (secondSelectError, result) => {
        user = result.rows;
        if(!_.isEmpty(user)) {
          return this.currentPromise.resolve(this._buildPayload("Cuantas personas queres ser?"));
        }

        query = `INSERT INTO users (user_id, telegram_id, created_at, updated_at) VALUES ('${userId}', '${telegramId}','now()','now()')`;
        pgConnection.query( query, () => {
          this.currentPromise.resolve(this._buildPayload("Bienvenido a la Fafafa Plus!"));
        });
      });
    });
  }

  _saveUser() {
    let userName = this._getUserName();

    if(userName) {
      Slack.getUserIdByName(userName)
           .then( user => {
             if(user) {
              this._insert(user.id);
             } else {
               return this.currentPromise.resolve(this._buildPayload("Q pones? Nadie se llama asi."));
             }
           });
    }
  }

  run() {
    let deferred = Q.defer();
    this.currentPromise = deferred;

    this._saveUser();

    return deferred.promise;
  }

}
