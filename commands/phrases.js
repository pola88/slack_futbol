import Command from "./command";
import Q from "q";
import phrasesJson from "../assets/phrases";

export default class Phrase extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Phrase";
  }

  static is(text) {
    let regExp = new RegExp(/.*(frase(s)?).*/, "i");

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();

    let index = Math.floor(Math.random() * phrasesJson.phrases.length);
    deferred.resolve(this._buildPayload("_" + phrasesJson.phrases[index] + "_"));

    return deferred.promise;
  }
}
