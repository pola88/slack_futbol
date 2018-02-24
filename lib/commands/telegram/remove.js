import RemoveBase from "../remove";
import pgConnection from "../../../lib/pg/connection";
import Slack from "../../models/slack";
import _ from "lodash";

export default class Remove extends RemoveBase {

  async another() {
    let userName = this._getUserName(this.payload.text);

    if(userName) {
      let user = await Slack.getUserIdByName(userName);
      let result;
      if(user) {
        result = await this._removeByUserId(user.id);
      } else {
        result = await this._removeByUserName(userName);
      }

      if (result.startsWith("galgo:")) {
        this.payload.sticker_id = "BQADAQADpgUAAkeJSwABT9f-cyPFZJQC"; // eslint-disable-line
        return "";
      } else {
        return result;
      }
    }

    return "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.";
  }

  me() {
    return new Promise( resolve => {
      let telegramId = this.payload.from.id;
      let query = `SELECT * FROM users WHERE telegram_id = '${telegramId}';`;
      pgConnection.query( query, async (selectError, selectResult) => {
        let user = selectResult.rows;
        if(_.isEmpty(user)) {
          resolve("No estas regstrado en la Fafafa Plus, registrate con /soy nombreEnSlack");
        } else {
          resolve(await this._remove(user[0].user_id));
        }
      });
    });
  }

}
