import Command from "./command";
import Q from "q";

export default class Message extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Message";
  }

  static is(text) {
    let regExp = new RegExp(/.*(msg:).*/, "i");

    return regExp.test(text);
  }

  get payload() {
    this._payload.channel = "C03CFASU7";
    return this._payload;
  }

  run() {
    let deferred = Q.defer();

    let msg = this.payload.text.replace(/msg:/gi, "");
    deferred.resolve(this._buildPayload(`${msg}`));

    return deferred.promise;
  }
}
