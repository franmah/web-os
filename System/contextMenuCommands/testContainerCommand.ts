import { ContextMenuCommand } from "./abstractCommand";
import ContextMenuCommandContainer from "./abstractCommandContainer";

export class TestContainerCommand extends ContextMenuCommandContainer {

  constructor(commands: ContextMenuCommand[]) {
    super('test', commands)
  }
}

export class SubTestCommand extends ContextMenuCommand {

  constructor(callback: () => void) {
    super('sub-test', callback);
  }

  execute(): void {
    this.callback();
  }
}