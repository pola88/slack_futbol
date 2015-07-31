import * as availableCommands from "./commands/index";
import _ from "lodash";

export default class Command {
  static find(payload) {
    let CurrentCommand = null;

    CurrentCommand = _.find(availableCommands, command => {
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
}
