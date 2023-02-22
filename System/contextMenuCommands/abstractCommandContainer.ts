import { ContextMenuCommand } from "./abstractCommand";
import { v4 as uuidv4 } from 'uuid';
import { ComponentType } from "react";

/**
 * For context menu items that have a list of commands.
 */
abstract class ContextMenuCommandContainer {
  text: string;
  commands: ContextMenuCommand[];
  id: string;
  icon: ComponentType;

  constructor(text: string, commands: ContextMenuCommand[], icon: ComponentType) {
    this.text = text;
    this.commands = commands || [];
    this.id = uuidv4();
    this.icon = icon;
  }
};

export default ContextMenuCommandContainer;
