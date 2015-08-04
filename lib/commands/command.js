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

  get payload() {
    return this._payload;
  }

  run() {
    let deferred = Q.defer();

    deferred.resolve(this._buildPayload(this._payload.text));

    return deferred.promise;
  }

  _buildPayload(text) {
    return { id: __ID__++, channel: this.payload.channel, text: text, type: "message" };
  }
}
