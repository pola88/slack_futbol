import Q from "q";
import request from "request-promise";
import _ from "lodash";

export default class Api{
  static getUserNames(userIds) {
    let deferred = Q.defer();
    let apiToken = process.env.PBOT_APITOKEN;
    let slackApi = process.env.SLACK_API;
    let allRequests = [];

    userIds.forEach( userId => {
      let userUrl = `${slackApi}/users.info?token=${apiToken}&user=${userId}`;
      allRequests.push(request(userUrl));
    });

    Q.all(allRequests)
     .then( response => {
       let users = _.map( response, body => {
         return JSON.parse(body).user;
       });

       deferred.resolve(users);
     });

    return deferred.promise;
  }
}
