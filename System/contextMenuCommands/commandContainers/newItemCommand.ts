import { DEFAULT_WIDTH_SUB_MENU } from "../../../components/system/contextMenu/contextMenuComponent";
import { ContextMenuCommand } from "../abstractCommand";
import ContextMenuCommandContainer from "../abstractCommandContainer";

export class NewItemCommandContainer extends ContextMenuCommandContainer {
  constructor(commands: (ContextMenuCommand | ContextMenuCommandContainer)[]) {
    super('New', commands, DEFAULT_WIDTH_SUB_MENU , require('react-icons/ai').AiOutlinePlusCircle);
  }
}