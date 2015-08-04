import Command from "./command";

export default class Type extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Typing";
  }

  get payload() {
    let botId = process.env.PBOT_ID;
    return { id: __ID__++, channel: this._payload.channel, user: botId, type: "typing" };
  }
}
