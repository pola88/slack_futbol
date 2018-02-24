import Command from "../command";
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
      return null;
    }

    return userName[1];
  }

  _insert(userId) {
    return new Promise( resolve => {
      if(!userId) {
        return resolve("Me estas haciendo perder el tiempo, fijate lo que escribiste.");
      }

      let query = `SELECT * FROM users WHERE user_id = '${userId}';`;
      pgConnection.query( query, (selectError, selectResult) => {
        let user = selectResult.rows;
        if(!_.isEmpty(user)) {
          return resolve("Ya estas registrado, si no fuiste vos, te cagaron.");
        }

        let telegramId = this.payload.from.id;
        query = `SELECT * FROM users WHERE telegram_id = '${telegramId}';`;
        pgConnection.query( query, (secondSelectError, result) => {
          user = result.rows;
          if(!_.isEmpty(user)) {
            return resolve("Cuantas personas queres ser?");
          }

          query = `INSERT INTO users (user_id, telegram_id, created_at, updated_at) VALUES ('${userId}', '${telegramId}','now()','now()')`;
          pgConnection.query( query, () => {
            resolve("Bienvenido a la Fafafa Plus!");
          });
        });
      });
    });
  }

  async _saveUser() {
    let userName = this._getUserName();

    if(userName) {
      let user = await Slack.getUserIdByName(userName);
       if (user) {
        return await this._insert(user.id);
       } else {
        return "Q pones? Nadie se llama asi.";
       }
    } else {
      return "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.";
    }
  }

  async run() {
    let text = await this._saveUser();

    this.bot.send(this.payload, this._buildPayload(text));
  }

}
