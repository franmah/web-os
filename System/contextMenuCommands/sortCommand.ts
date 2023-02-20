import { ContextMenuCommand } from "./abstractCommand";
import ContextMenuCommandContainer from "./abstractCommandContainer";

export class SortByNameCommand extends ContextMenuCommand {

  constructor(callback: () => void) {
    super('name', callback);
  }

  execute(): void {
      this.callback();
  }
}

// TODO: change this to have an execute function but 
// it triggers when a sub command is clicked? and it passes the name of the command?
// You could pass it a bench of strings of Sorting options
export class SortCommandContainer extends ContextMenuCommandContainer {
  
  constructor (commands: ContextMenuCommand[]) {
    super('Sort by', commands);
  }

}