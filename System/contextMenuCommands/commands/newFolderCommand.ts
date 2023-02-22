import { ContextMenuCommand } from "../abstractCommand";

export class NewFolderCommand extends ContextMenuCommand {
  constructor (callback: () => any) {
    super('Folder', callback, require('react-icons/fc').FcFolder);
  }

  execute() {
    this.callback();
  }
}