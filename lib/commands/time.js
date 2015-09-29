import Command from "./command";
import Q from "q";

export default class Time extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Time";
  }

  static is(text) {
    let regExp = new RegExp(/.*(hora).*/, "i");

    return regExp.test(text);
  }

  static checkForRemove(text) {
    let regExp = new RegExp(/.*(cronica:).*/, "i");

    return regExp.test(text);
  }

  get payload() {
    this._payload.channel = "C03CFASU7";
    return this._payload;
  }

  run() {
    let deferred = Q.defer();

    deferred.resolve(this._buildPayload("cronica: Se juega a las 8:45!! y no es negociable."));

    return deferred.promise;
  }
}
