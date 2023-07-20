import { ContextMenuCommand } from '../AbstractCommand';

export class GeneralImageCommand extends ContextMenuCommand {
  private callback: () => any;

  constructor(text: string, iconPath: string, callback: () => any) {
    super(text, undefined, iconPath);
    this.callback = callback;
  }

  execute = (): boolean => {
      this.callback();
      return true;
  };
}
