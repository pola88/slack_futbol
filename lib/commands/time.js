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

  run() {
    let deferred = Q.defer();

    deferred.resolve(this._buildPayload("Se juega a las 8:45!! y no es negociable."));

    return deferred.promise;
  }
}
