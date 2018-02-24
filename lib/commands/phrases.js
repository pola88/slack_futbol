import Command from "./command";
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
    let index = Math.floor(Math.random() * phrasesJson.phrases.length);

    this.bot.send(this.payload, this._buildPayload("_" + phrasesJson.phrases[index] + "_"));
  }
}
