import { ContextMenuCommand } from '../AbstractCommand';

export class GeneralIconCommand extends ContextMenuCommand {
  private callback: () => any;

  constructor(text: string, icon: any, callback: () => any) {
    super(text, icon, undefined);
    this.callback = callback;
  }

  execute = (): boolean => {
      this.callback();
      return true;
  };
}
