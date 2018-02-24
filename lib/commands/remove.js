import Command from "./command";
import pgConnection from "../../lib/pg/connection";

export default class Remove extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Remove";
  }

  static is(text) {
    let regExp = new RegExp(/.*(baja).*/, "i");

    return regExp.test(text);
  }

  after() {
    // let deferred = Q.defer();
    //
    // payload.text = `lista`;
    // deferred.resolve(payload);
    //
    // return deferred.promise;
  }

  static checkForRemove(text) {
    let regExp = new RegExp(/.*(galgo:).*/, "i");

    return regExp.test(text);
  }

  _getUserId(text) {
    let regExp = new RegExp(/.*<@(.*)>.*/, "i");
    let userId = regExp.exec(text);

    if(!userId) {
      return null;
    }

    return userId[1];
  }

  _getUserName(text) {
    let regExp = new RegExp(/baja.*? (.*)+/, "i");
    let userName = regExp.exec(text);

    if(!userName) {
      return null;
    }

    return userName[1].split(" ").join("_");
  }

  async another() {
    let userId = this._getUserId(this.payload.text);
    let result = "";

    if(userId) {
      return await this._removeByUserId(userId);
    }

    let userName = this._getUserName(this.payload.text);

    if (userName) {
      result = await this._removeByUserName(userName);
    } else {
      result = "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.";
    }

    return result;
  }

  me() {
    return this._removeByUserId(this.payload.user);
  }

  _removeByUserName(userName) {
    return new Promise( async (resolve) => {
      if(!userName) {
        return resolve("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.");
      }

      let query = `DELETE FROM players WHERE user_name = '${userName.toLowerCase()}';`;
      resolve(await this._remove(query));
    });
  }

  _removeByUserId(userId) {
    return new Promise( async (resolve) => {
      if(!userId) {
        return resolve("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.");
      }

      let query = `DELETE FROM players WHERE user_id = '${userId}';`;

      resolve(await this._remove(query));
    });
  }

  _remove(query) {
    return new Promise( (resolve) => {
      pgConnection.query( query, (error, result) => {
        if (result.rowCount === 0) {
          resolve("Nunca tuviste huevos para anotarte");
        } else {
          resolve("galgo: Daaaa...posta te vas a bajar?");
        }
      });
    });
  }

  async run() {
    let regExp = new RegExp(/.*(baja .*).*/, "i");
    let anotherPlayer = regExp.test(this.payload.text);
    let text = "";

    if(anotherPlayer) {
      text = await this.another();
    } else {
      text = await this.me();
    }

    this.slack.replyWithTyping(this.payload, this._buildPayload(text));
  }
}
