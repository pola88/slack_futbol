import Command from "./command";

export default class Help extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Help";
  }

  static is(text) {
    let regExp = new RegExp(/.*(help).*/, "i");

    return regExp.test(text);
  }

  run() {
    let text = "Vos decime y te digo: \n";
    text += "* `hora` _Cuando se juega_ \n";
    text += "* `quienes` `lista` `jugadores` _Quienes juegan_ \n";
    text += "* `juego` `juega @usuario` _Si jugas o agregas a alguno_ \n";
    text += "* `baja` `baja @usuario` _Si te bajas o si no juega alguno_ \n";
    text += "* `frases` _Te dira algo sabio de la vida (o no)_ \n";
    text += "* `random` _Te arma super equipos_ \n";
    text += "* `equipos` _Te muestra el ultimo gran random \n";

    this.bot.send(this.payload, this._buildPayload(text));
  }
}
