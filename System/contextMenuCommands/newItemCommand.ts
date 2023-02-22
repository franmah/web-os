import { ContextMenuCommand } from "./abstractCommand";
import ContextMenuCommandContainer from "./abstractCommandContainer";

export class NewItemCommandContainer extends ContextMenuCommandContainer {
  constructor(commands: ContextMenuCommand[]) {
    super('New', commands, require('react-icons/ai').AiOutlinePlusCircle);
  }
}