import Q from 'q';

export default class Command {
  constructor(payload) {
    this._payload = payload;
    this._name = 'Unnamed';
  }

  name() {
    return this._name;
  }

  static is(text) {
    throw new Error('Not implemented');
  }

  get payload() {
    return this._payload;
  }

  run() {
    let deferred = Q.defer();

    deferred.resolve(this._payload);

    return deferred.promise;
  }

  _buildPayload(text) {
    return { channel: this.payload.channel, text: text, type: "message" };
  }
}
