import RemoveBase from "../remove";
import pgConnection from "../../../lib/pg/connection";
import Slack from "../../models/slack";
import _ from "lodash";

export default class Remove extends RemoveBase {

  another() {
    let userName = this._getUserName(this.payload.text);

    if(userName) {
      Slack.getUserIdByName(userName)
           .then( user => {
             if(user) {
               this._remove(user.id);
             } else {
               return this.currentPromise.resolve(this._buildPayload("Q pones? Nadie se llama asi."));
             }
           });
    }
  }

  _remove(userId) {
    if(!userId) {
      return this.currentPromise.resolve(this._buildPayload("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo."));
    }

    let query = `DELETE FROM players WHERE user_id = '${userId}';`;
    pgConnection.query( query, (error, result) => {
      if(result.rowCount === 0) {
        return this.currentPromise.resolve(this._buildPayload("Ya te diste de baja antes cagon!!(o escribiste cualquier cosa)"));
      }

      let payload = this._buildPayload("");
      payload.sticker_id = "BQADAQADpgUAAkeJSwABT9f-cyPFZJQC"; // eslint-disable-line
      return this.currentPromise.resolve(payload);
    });
  }

  _getUserName(text) {
    let regExp = new RegExp(/baja (.*)+/, "i");
    let userName = regExp.exec(text);

    if(!userName) {
      return this.currentPromise.resolve(this._buildPayload("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo."));
    }

    return userName[1];
  }

  me() {
    let telegramId = this.payload.from.id;
    let query = `SELECT * FROM users WHERE telegram_id = '${telegramId}';`;
    pgConnection.query( query, (selectError, selectResult) => {
      let user = selectResult.rows;
      if(_.isEmpty(user)) {
        return this.currentPromise.resolve(this._buildPayload("No estas regstrado en la Fafafa Plus, registrate con /soy nombreEnSlack"));
      } else {
        this._remove(user[0].user_id);
      }
    });
  }

}
