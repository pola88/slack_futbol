import AddBase from "../add";
import _ from "lodash";
import Slack from "../../models/slack";
import pgConnection from "../../../lib/pg/connection";

export default class Add extends AddBase {

  another() {
    let userName = this._getUserName(this.payload.text);
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

  _getUserName(text) {
    let regExp = new RegExp(/juega (.*)+/, "i");
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
        this._insert(user[0].user_id);
      }
    });
  }

}
