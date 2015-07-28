import Command from './command';
import pgConnection from "../lib/pg/connection";
import Q from 'q';
import _ from 'lodash';

export default class Remove extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Remove";
    this._currentPromise = null;
  }

  static is(text) {
    let regExp = new RegExp(/.*(baja).*/,'i');

    return regExp.test(text);
  }

  set currentPromise(promise) {
    this._currentPromise = promise;
  }

  get currentPromise() {
    return this._currentPromise;
  }

  _getUserId(text) {
    let regExp = new RegExp(/.*<@(.*)>.*/,'i');
    let userId = regExp.exec(text);

    if(!userId) {
      return this.currentPromise.resolve(this._buildPayload('Falto el nombre, no me hagas perder el tiempo. (Agrega @)'));
    }

    return userId[1];
  }

  another() {
    let userId = this._getUserId(this.payload.text);
    this._remove(userId);
  }

  me() {
    this._remove(this.payload.user);
  }

  _remove(userId) {
    let query = `DELETE FROM players WHERE user_id = '${userId}';`;
    pgConnection.query( query, (error, result) => {
      return this.currentPromise.resolve(this._buildPayload('Todo Pasa.'));
    });
  }

  buildPayload() {
    let deferred = Q.defer();

    let regExp = new RegExp(/.*(baja <@.*>).*/,'i');
    let anotherPlayer = regExp.test(this.payload.text)

    this.currentPromise = deferred;

    if(anotherPlayer) {
      this.another();
    } else {
      this.me();
    }

    return deferred.promise;
  }
}
