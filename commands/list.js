import Command from './command';
import pgConnection from "../lib/pg/connection";
import Q from 'q';
import _ from 'lodash';

export default class List extends Command {

  constructor(payload) {
    super(payload);
    this._name = "List";
  }

  static is(text) {
    let regExp = new RegExp(/.*(quienes|lista|jugadores).*/,'i');

    return regExp.test(text);
  }

  run() {
    let deferred = Q.defer();

    pgConnection.query("SELECT * FROM players", (error, result) => {
      let players = result.rows;
      if(_.isEmpty(players)) {
        deferred.resolve(this._buildPayload('Todos putos, nadie juega!!'));
      }

      let userIds = _.pluck(players, 'user_id');
      userIds = _.map(userIds, userId => { return `<@${userId}>`; } );

      deferred.resolve(this._buildPayload('Por ahora los q juegan son: ' + userIds.join(', ') ));
    });


    return deferred.promise;
  }
}
