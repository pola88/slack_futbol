import Command from "./command";

export default class TelegramCommands {
  constructor(bot) {
    this.bot = bot;
    this.command = new Command(true);
  }

  send(req, payload) {
    let options = {};
    options.reply_to_message_id = payload.replyToMessageId; // eslint-disable-line

    if(payload.sticker_id) {
      this.bot.sendSticker(payload.chatId, payload.sticker_id, options);
    } else {
      options.parse_mode = "html"; // eslint-disable-line
      this.bot.sendMessage(payload.chatId, payload.text, options);
    }

  }

  incomingMessage(msg, match) {
    msg.telegram = true;
    //remove the first slash
    msg.text = match[1];

    let command = this.command.find(msg);

    if(!command) {
      return "";
    }

    this.typing(msg.chat.id);

    command.bot = this;

    try {
      command.run();
    } catch(e) {
      console.error("Error: ", e);
    }
  }

  typing(chatId) {
    this.bot.sendChatAction(chatId, "typing");
  }
}
