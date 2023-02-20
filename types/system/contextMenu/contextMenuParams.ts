import { ContextMenuCommand } from "../../../System/contextMenuCommands/abstractCommand";
import { ContextMenuCommandContainer } from "../../../System/contextMenuCommands/abstractCommandContainer";

export type ContextMenuParams = {
  top: number,
  left: number,
  commands: (ContextMenuCommand | ContextMenuCommandContainer) []
};