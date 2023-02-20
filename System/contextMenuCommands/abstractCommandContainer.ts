import { ContextMenuCommand } from "./abstractCommand";
import { v4 as uuidv4 } from 'uuid';

/**
 * For context menu items that have a list of commands.
 */
abstract class ContextMenuCommandContainer {
  text: string;
  commands: ContextMenuCommand[];
  id: string;

  constructor(text: string, commands: ContextMenuCommand[]) {
    this.text = text;
    this.commands = commands || [];
    this.id = uuidv4();
  }
};

export default ContextMenuCommandContainer;
