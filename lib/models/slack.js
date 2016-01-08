import Q from "q";
import _ from "lodash";
import User from "./user";
import Api from "../helpers/api";

export default class Slack {
  static getUsers(userIds) {
    let deferred = Q.defer();
    let allPromises = [];

    userIds.forEach( userId => {
      allPromises.push(Slack.getUser(userId));
    });

    Q.all(allPromises)
     .then( users => {
       deferred.resolve(users);
     });

    return deferred.promise;
  }

  static getUser(userId) {
    let deferred = Q.defer();

    Api.getUser(userId)
       .then( result => {
         let user = new User(result);
         deferred.resolve(user);
       });

    return deferred.promise;
  }

  static allUsers() {
    let deferred = Q.defer();
    Api.allUsers()
       .then( allusers => {
         let users = [];
         allusers.forEach( user => {
           users.push(new User(user));
         });

         deferred.resolve(users);
       });

    return deferred.promise;
  }

  static getUserIdByName(name) {
    let deferred = Q.defer();

    Slack.allUsers()
         .then( users => {
           let user = _.find(users, currentUser => currentUser.name.toLowerCase() === name.toLowerCase());
           deferred.resolve(user);
         });

    return deferred.promise;
  }

}
