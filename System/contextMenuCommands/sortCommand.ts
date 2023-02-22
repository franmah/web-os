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

export class SortCommandContainer extends ContextMenuCommandContainer {
  constructor (commands: ContextMenuCommand[]) {
    super('Sort by', commands, require('react-icons/fc').FcAlphabeticalSortingAz);
  }

}