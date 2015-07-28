import * as availableCommands from './commands/index';
import _ from 'lodash';
let validCommands = ['list', 'in', 'out', 'time'];

export default class Commands {
  static validate(payload) {
    let currentCommand = null;

    currentCommand = _.find(availableCommands, command => {
      return command.is(payload.text);
    });

    if(currentCommand) {
      currentCommand = new currentCommand(payload);
      console.log("Command: ", currentCommand.name());
      return currentCommand;
    } else {
      return null;
    }
  }
}
