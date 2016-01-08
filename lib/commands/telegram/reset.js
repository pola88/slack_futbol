import Command from "../command";
import Q from "q";
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
    let telegramId = this.payload.from.id;
    let query = `DELETE FROM users WHERE telegram_id = '${telegramId}';`;
    pgConnection.query( query, () => {
      this.currentPromise.resolve(this._buildPayload("Te quisiste robar la identidad de alguien eh!"));
    });
  }

  run() {
    let deferred = Q.defer();
    this.currentPromise = deferred;

    this._remove();

    return deferred.promise;
  }

}
