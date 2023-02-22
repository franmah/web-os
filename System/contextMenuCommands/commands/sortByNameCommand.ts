import { ContextMenuCommand } from "../abstractCommand";

export class SortByNameCommand extends ContextMenuCommand {

  constructor(callback: () => void) {
    super('Name', callback);
  }

  execute(): void {
      this.callback();
  }
}