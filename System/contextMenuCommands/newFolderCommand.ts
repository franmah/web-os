import { ContextMenuCommand } from "./abstractCommand";

export class NewFolderCommand extends ContextMenuCommand {
  constructor (callback: () => any) {
    super('New folder', callback, require('react-icons/fc').FcFolder);
  }

  execute() {
    this.callback();
  }
}