import Command from './command';
import pgConnection from "../lib/pg/connection";
import Q from 'q';
import _ from 'lodash';
import phrasesJson from '../assets/phrases';

export default class Phrase extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Phrase";
  }

  static is(text) {
    let regExp = new RegExp(/.*(frases).*/,'i');

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();

    let index = Math.floor(Math.random() * phrasesJson.phrases.length);
    deferred.resolve(this._buildPayload('_"' + phrasesJson.phrases[index] + '"_'));

    return deferred.promise;
  }
}
