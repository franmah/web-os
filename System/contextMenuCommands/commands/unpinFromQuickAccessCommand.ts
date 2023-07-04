import { ContextMenuCommand } from "../abstractCommand";

export class UnpinFromQuickAccessCommand extends ContextMenuCommand {
  
  private callback: () => any;
  
  constructor (callback: () => any) {
    super('Unpin from Quick Access', require('react-icons/fc').FcFolder);
    this.callback = callback;
  }

  execute = (): boolean => {
    this.callback();
    return true;
  }
}