import { ContextMenuCommand } from "../abstractCommand";

export class PinToQuickAccessCommand extends ContextMenuCommand {
  
  private callback: () => any;
  
  constructor (callback: () => any) {
    super('Pin to Quick Access', require('react-icons/fc').FcFolder);
    this.callback = callback;
  }

  execute = (): boolean => {
    this.callback();
    return true;
  }
}