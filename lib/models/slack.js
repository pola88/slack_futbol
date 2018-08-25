import _ from "lodash";
import User from "./user";
import Api from "../helpers/api";

export default class Slack {
  static getUsers(userIds) {
    let allPromises = [];

    userIds.forEach( userId => {
      allPromises.push(Slack.getUser(userId));
    });

    return Promise.all(allPromises);
  }

  static getUser(userId) {
    return new Promise( (resolve, reject) => {
      Api.getUser(userId)
       .then( result => {
         let user = new User(result);
         resolve(user);
       }, reject);
    });
  }

  static allUsers() {
    return new Promise( (resolve, reject) => {
      Api.allUsers()
       .then( allusers => {
         let users = [];
         allusers.forEach( user => {
           users.push(new User(user));
         });

         resolve(users);
       }, reject);
    });
  }

  static getUserIdByName(name) {
    return new Promise( (resolve, reject) => {
      Slack.allUsers()
       .then( users => {
         let user = _.find(users, currentUser => currentUser.name.toLowerCase() === name.toLowerCase());
         resolve(user);
       }, reject);
    });
  }

}
