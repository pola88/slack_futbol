import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import _ from "lodash";
import Slack from "../models/slack";

export default class Add extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Add";
  }

  static is(text) {
    let regExp = new RegExp(/.*(juego|juega).*/, "i");

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
    let regExp = new RegExp(/juega.*? (.*)+/, "i");
    let userName = regExp.exec(text);

    if(!userName) {
      // return resolve(this._buildPayload("Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo."));
      return null;
    }

    return userName[1].split(" ").join("_");
  }

  async another() {
    let userId = this._getUserId(this.payload.text);
    let result;

    if(userId) {
      result = await this._insertById(userId);
    } else {
      let userName = this._getUserName(this.payload.text);

      if (userName) {
        result = await this._insertByUserName(userName);
      } else {
        result = "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.";
      }
    }

    return result;
  }

  async me() {
    return await this._insertById(this.payload.user);
  }

  _insertById(userId) {
    return new Promise( (resolve) => {
      if(!userId) {
        return resolve("Me estas haciendo perder el tiempo, fijate lo que escribiste.");
      }

      let query = "";

      query = `SELECT * FROM players WHERE user_id = '${userId}';`;
      pgConnection.query( query, async (selectError, selectResult) => {
        let player = selectResult.rows;
        if(!_.isEmpty(player)) {
          return resolve("Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?");
        }

        query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('${userId}','now()','now()')`;

        let result = await this._insert(query);

        resolve(result);
      });
    });
  }

  _insertByUserName(userName) {
    return new Promise( (resolve) => {
      if(!userName) {
        return resolve("Me estas haciendo perder el tiempo, fijate lo que escribiste.");
      }

      userName = userName.toLowerCase();

      let query = "";
      query = `SELECT * FROM players WHERE user_name = '${userName}';`;
      pgConnection.query( query, async (selectError, selectResult) => {
        let player = selectResult.rows;
        if(!_.isEmpty(player)) {
          return resolve("Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?");
        }

        query = `INSERT INTO players (user_name, created_at, updated_at) VALUES ('${userName}','now()','now()')`;

        let result = await this._insert(query);

        resolve(result);
      });
    });
  }

  _insert(query) {
    return new Promise( (resolve) => {
      pgConnection.query( query, () => {
        this._getCurrentPlayers( (error, { count, players }) => {
          if( +count >= 12 ) {
            return resolve("Al banco, por ahi el Paton te da una oportunidad...nosotros te llamamos...");
          } else {
            let playersIds = _.compact(_.map(players, "user_id"));
            let userNames = _.compact(_.map(players, "user_name"));

            Slack.getUsers(playersIds)
               .then( userInfo => {
                 let slackUserNames = _.map(userInfo, "name");
                 let allNames = _.union(userNames, slackUserNames);
                 resolve(`Que viva el futbol!!\nAhora somos ${allNames.length}:\n ${allNames.join(", ")}` );
               });
          }
        });
      });
    });
  }

  _getCurrentPlayers(callback) {
    let query = "SELECT * FROM players ORDER BY created_at ASC;";

    pgConnection.query( query, (error, result) => {
      if (error) {
        return callback(error);
      }

      let count = result.rows.length;
      let players = result.rows;

      callback(null, { count, players});
    });
  }

  async run() {
    let regExp = new RegExp(/.*(juega).*/, "i");
    let anotherPlayer = regExp.test(this.payload.text);

    let text;

    if(anotherPlayer) {
      text = await this.another();
    } else {
      text = await this.me();
    }

    this.slack.replyWithTyping(this.payload, this._buildPayload(text));
  }
}
