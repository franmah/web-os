import { ContextMenuCommand } from "./abstractCommand";

/**
 * For context menu items that have a list of commands.
 */
abstract class ContextMenuCommandContainer {
  text: string;
  commands: ContextMenuCommand[];

  constructor(text: string, commands: ContextMenuCommand[]) {
    this.text = text;
    this.commands = commands || [];
  }
};

export default ContextMenuCommandContainer;
