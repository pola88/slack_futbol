import Command from "../command";
import pgConnection from "../../../lib/pg/connection";

export default class Add extends Command {

  constructor(payload) {
    super(payload);
    this._name = "IAmNot";
  }

  static is(text) {
    let regExp = new RegExp(/.*(reset).*/, "i");

    return regExp.test(text);
  }

  _remove() {
    return new Promise( resolve => {
      let telegramId = this.payload.from.id;
      let query = `DELETE FROM users WHERE telegram_id = '${telegramId}';`;
      pgConnection.query( query, (error, result) => {
        if (result.rowCount === 0) {
          resolve("Y vo quien so?");
        } else {
          resolve("Te quisiste robar la identidad de alguien eh!");
        }
      });
    });
  }

  async run() {
    let text = await this._remove();

    this.bot.send(this.payload, this._buildPayload(text));
  }

}
