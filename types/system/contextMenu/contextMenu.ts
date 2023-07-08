import { ContextMenuCommand } from "../../../System/context-menu-commands/AbstractCommand";
import ContextMenuCommandContainer from "../../../System/context-menu-commands/AbstractCommandContainer";
import { ShortcutCommand } from "../../../System/context-menu-commands/ShortcutCommand";

export type ContextMenuParams = {
  top: number,
  left: number,
  width: number,
  commands: ContextMenuCommandList,
  shortcutCommands?: ShortcutCommand[]
};

export type ContextMenuCommandList = (ContextMenuCommand | ContextMenuCommandContainer) [];