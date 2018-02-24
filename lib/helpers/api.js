import request from "request-promise";

export default class Api {

  static getUser(userId) {
    return new Promise( (resolve, reject) => {
      let apiToken = process.env.PBOT_APITOKEN;
      let slackApi = process.env.SLACK_API;
      let userUrl = `${slackApi}/users.info?token=${apiToken}&user=${userId}`;

      request(userUrl)
        .then( body => {
          resolve(JSON.parse(body).user);
        }, reject);
    });
  }

  static getUsers(userIds) {
    let allRequests = [];

    userIds.forEach( userId => {
      allRequests.push(Api.getUser(userId));
    });

    return Promise.all(allRequests);
  }

  static getUserIds() {
    return new Promise( (resolve, reject) => {
      let apiToken = process.env.PBOT_APITOKEN;
      let slackApi = process.env.SLACK_API;

      let apiUrl = `${slackApi}/channels.info?token=${apiToken}&channel=C03CFASU7`;
      request(apiUrl)
       .then( response => {
         let members = JSON.parse(response).channel.members;
         resolve(members);
       }, reject);
    });
  }

  static allUsers() {
    return Api.getUserIds()
              .then( members => {
                return Api.getUsers(members);
              });
  }

}
