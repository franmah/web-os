import { DEFAULT_WIDTH_SUB_MENU } from "../../../components/system/contextMenu/contextMenuComponent";
import { ContextMenuCommand } from "../abstractCommand";
import ContextMenuCommandContainer from "../abstractCommandContainer";


export class Test1Container extends ContextMenuCommandContainer {
  constructor() {
    const commands = [
      new Test2Container()
    ]

    super('Test', commands , DEFAULT_WIDTH_SUB_MENU, require('react-icons/ai').AiOutlinePlusCircle)
  }
}

export class Test2Container extends ContextMenuCommandContainer {
  constructor() {
    const commands = [
      new EndTestCommand()
    ]

    super('Sub test', commands, DEFAULT_WIDTH_SUB_MENU,
    require('react-icons/ai').AiOutlinePlusCircle)
  }
}

export class EndTestCommand extends ContextMenuCommand {
  
  private callback: () => any;

  execute(): boolean {
    return false;
  }

  constructor() {
    super('end');
    this.callback = () => console.log('end')
  }
}