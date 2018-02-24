import Command from "./command";
import pgConnection from "../../lib/pg/connection";
import _ from "lodash";
import phrasesJson from "../assets/phrases";

export default class Start extends Command {

  constructor(payload) {
    super(payload);
    this._name = "Start";
  }

  static is(text) {
    let regExp = new RegExp(/.*(start).*/, "i");

    return regExp.test(text);
  }

  get payload() {
    this._payload.channel = "C03CFASU7";
    // this._payload.channel = "C4ZNZMD3Q";
    return this._payload;
  }

  run() {
    pgConnection.query("SELECT * FROM players ORDER BY created_at ASC;", (error, result) => {
      let players = result.rows;
      if(_.isEmpty(players)) {
        return this.slack.replyWithTyping(this.payload, this._buildPayload("Todos putos, nadie juega!!"));
      }

      let firstTeamPlayer = _.slice(players, 0, 12);
      let waitingToPlay = _.slice(players, 12);

      let userIds = _.compact(_.map(firstTeamPlayer, "user_id"));
      userIds = _.map(userIds, userId => { return `<@${userId}>`; } );
      userIds = _.union(userIds, _.compact(_.map(firstTeamPlayer, "user_name")));

      let index = Math.floor(Math.random() * phrasesJson.phrases.length);
      let text = "";
      if(userIds.length < 12) {
        text = `<!channel> "_${phrasesJson.phrases[index]}_", que viva el futbol!!! por ahora somos ${userIds.length}: ${userIds.join(", ")}. Se suma alguien? Alguien se baja?`;
      } else if(waitingToPlay.length === 0) {
        text = `<!channel> "_${phrasesJson.phrases[index]}_", que viva el futbol!!! ya estamos los 12: ${userIds.join(", ")}. si alguien se baja, avise...`;
      } else {
        let waitingIds = _.map(waitingToPlay, "user_id");
        waitingIds = _.compact(_.map(waitingIds, userId => { return `<@${userId}>`; } ));
        waitingIds = _.union(_.compact(_.map(waitingToPlay, "user_name")), waitingIds);

        text = `<!channel> "_${phrasesJson.phrases[index]}_", que viva el futbol!!! ya estamos los 12: ${userIds.join(", ")}. Esperando la llamada del Paton: ${waitingIds.join(", ")}`;
      }

      this.slack.replyWithTyping(this.payload, this._buildPayload(text));
    });
  }
}
