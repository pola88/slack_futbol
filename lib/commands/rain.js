import Command from "./command";
import Q from "q";

export default class Rain extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Rain";
  }

  static is(text) {
    let regExp = new RegExp(/.*(lluvia|llover|llueve).*/, "i");

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();

    deferred.resolve(this._buildPayload("Quien dice q va a llover?? Va a estar soleado, perfecto para ver el buen futbol."));

    return deferred.promise;
  }
}
