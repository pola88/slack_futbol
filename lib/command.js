import * as availableCommands from "./commands/index";
import * as availableCommandsForTelegram from "./commands/telegram/index";
import _ from "lodash";

export default class Command {
  constructor(telegram) {
    if(telegram) {
      this.commands = availableCommandsForTelegram;
    } else {
      this.commands = availableCommands;
    }
  }

  find(payload) {
    let CurrentCommand = null;

    CurrentCommand = _.find(this.commands, command => {
      return command.is(payload.text);
    });

    if(CurrentCommand) {
      let currentCommand = new CurrentCommand(payload);
      console.log("Command: ", currentCommand.name);
      return currentCommand;
    } else {
      return null;
    }
  }

  findToRemove(payload) {
    let CurrentCommand = null;

    CurrentCommand = _.find(this.commands, command => {
      return command.checkForRemove(payload.text);
    });

    if(CurrentCommand) {
      let currentCommand = new CurrentCommand(payload);
      console.log("Remove text for command: ", currentCommand.name);
      return currentCommand;
    } else {
      return null;
    }
  }
}
