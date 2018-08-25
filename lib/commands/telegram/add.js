import AddBase from "../add";
import _ from "lodash";
import Slack from "../../models/slack";
import pgConnection from "../../../lib/pg/connection";

export default class Add extends AddBase {

  async another() {
    let userName = this._getUserName(this.payload.text);
    if(userName) {
      let user = await Slack.getUserIdByName(userName);
      if(user) {
        return await this._insertById(user.id);
      } else {
        return await this._insertByUserName(userName);
      }
    }

    return "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.";
  }

  me() {
    return new Promise( (resolve) => {
      let telegramId = this.payload.from.id;
      let query = `SELECT * FROM users WHERE telegram_id = '${telegramId}';`;
      pgConnection.query( query, async (selectError, selectResult) => {
        let user = selectResult.rows;
        if(_.isEmpty(user)) {
          return resolve("No estas regstrado en la Fafafa Plus, registrate con /soy nombreEnSlack");
        } else {
          let result = await this._insertById(user[0].user_id);

          resolve(result);
        }
      });
    });
  }

}
