import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import Q from "q";

export default class Remove extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Remove";
    this._currentPromise = null;
  }

  static is(text) {
    let regExp = new RegExp(/.*(baja).*/, "i");

    return regExp.test(text);
  }

  set currentPromise(promise) {
    this._currentPromise = promise;
  }

  get currentPromise() {
    return this._currentPromise;
  }

  _getUserId(text) {
    let regExp = new RegExp(/.*<@(.*)>.*/, "i");
    let userId = regExp.exec(text);

    if(!userId) {
      return this.currentPromise.resolve(this._buildPayload("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo."));
    }

    return userId[1];
  }

  another() {
    let userId = this._getUserId(this.payload.text);

    if(userId) {
      this._remove(userId);
    }
  }

  me() {
    this._remove(this.payload.user);
  }

  _remove(userId) {
    if(!userId) {
      return this.currentPromise.resolve(this._buildPayload("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo."));
    }

    let query = `DELETE FROM players WHERE user_id = '${userId}';`;
    pgConnection.query( query, () => {
      return this.currentPromise.resolve(this._buildPayload("galgo: Posta te vas a bajar?"));
    });
  }

  run() {
    let deferred = Q.defer();

    let regExp = new RegExp(/.*(baja .*).*/, "i");
    let anotherPlayer = regExp.test(this.payload.text);

    this.currentPromise = deferred;

    if(anotherPlayer) {
      this.another();
    } else {
      this.me();
    }

    return deferred.promise;
  }
}
