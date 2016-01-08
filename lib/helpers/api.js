import Q from "q";
import request from "request-promise";

export default class Api {

  static getUser(userId) {
    let deferred = Q.defer();

    let apiToken = process.env.PBOT_APITOKEN;
    let slackApi = process.env.SLACK_API;
    let userUrl = `${slackApi}/users.info?token=${apiToken}&user=${userId}`;

    request(userUrl)
      .then( body => {
        deferred.resolve(JSON.parse(body).user);
      });

    return deferred.promise;
  }

  static getUsers(userIds) {
    let allRequests = [];

    userIds.forEach( userId => {
      allRequests.push(Api.getUser(userId));
    });

    return Q.all(allRequests);
  }

  static getUserIds() {
    let deferred = Q.defer();
    let apiToken = process.env.PBOT_APITOKEN;
    let slackApi = process.env.SLACK_API;

    let apiUrl = `${slackApi}/channels.info?token=${apiToken}&channel=C03CFASU7`;
    request(apiUrl)
     .then( response => {
       let members = JSON.parse(response).channel.members;
       deferred.resolve(members);
     });

    return deferred.promise;
  }

  static allUsers() {
    return Api.getUserIds()
              .then( members => {
                return Api.getUsers(members);
              });
  }

}
