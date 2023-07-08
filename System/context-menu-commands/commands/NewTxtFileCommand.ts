import { ContextMenuCommand } from "../AbstractCommand";

export class NewTxtFileCommand extends ContextMenuCommand {

  private callback: () => any;


  constructor(callback: () => any) {
    super('Text File', require('react-icons/fc').FcFolder);
    this.callback = callback;
  }

  execute = (): boolean => {
    this.callback();
    return true;
  }
}