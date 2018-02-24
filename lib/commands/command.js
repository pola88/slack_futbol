import Q from "q";

export default class Command {
  constructor(payload) {
    this._payload = payload;
    this._name = "Unnamed";
  }

  get name(){
    return this._name;
  }

  static is(text) {
    console.log(text);
    throw new Error("Not implemented");
  }

  static checkForRemove() {
    return false;
  }

  get payload() {
    return this._payload;
  }

  after() {
    return null;
  }

  run() {
    let deferred = Q.defer();

    deferred.resolve(this._buildPayload(this._payload.text));

    return deferred.promise;
  }

  _buildPayload(text) {
    let d = new Date();
    let result = {
      id: +d,
      text: text
    };

    //TODO: telegram have chat id instead of channel.
    if(this.payload.telegram) {
      result.chatId = this.payload.chat.id;
      result.replyToMessageId = this.payload.message_id;
      if (this.payload.sticker_id) {// eslint-disable-line
        result.sticker_id = this.payload.sticker_id;// eslint-disable-line
      }
    } else {
      result.type = "message";
      result.channel = this.payload.channel;
      if(this.payload.mrkdwn) {
        result.mrkdwn = true;
      }
    }

    return result;
  }
}
