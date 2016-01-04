import Command from "./command";

export default class TelegramCommands {
  constructor(bot) {
    this.bot = bot;
  }

  open() {
    console.log("Connected");
  }

  send(payload) {
    let options = {};
    options.reply_to_message_id = payload.replyToMessageId; // eslint-disable-line

    this.bot.sendMessage(payload.chatId, payload.text, options);
  }

  incomingMessage(msg, match) {
    msg.telegram = true;
    //remove the first slash
    msg.text = match[1];

    let command = Command.find(msg);

    if(!command) {
      return "";
    }

    this.typing(msg.chat.id);

    try {
      command.run()
             .then( result => {
                this.send(result);
             });
    } catch(e) {
      console.error("Error: ", e);
    }
  }

  typing(chatId) {
    this.bot.sendChatAction(chatId, "typing");
  }
}
