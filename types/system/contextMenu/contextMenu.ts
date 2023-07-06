import { ContextMenuCommand } from "../../../System/contextMenuCommands/abstractCommand";
import ContextMenuCommandContainer from "../../../System/contextMenuCommands/abstractCommandContainer";
import { ShortcutCommand } from "../../../System/contextMenuCommands/shortcut-command";

export type ContextMenuParams = {
  top: number,
  left: number,
  width: number,
  commands: ContextMenuCommandList,
  shortcutCommands?: ShortcutCommand[]
};

export type ContextMenuCommandList = (ContextMenuCommand | ContextMenuCommandContainer) [];