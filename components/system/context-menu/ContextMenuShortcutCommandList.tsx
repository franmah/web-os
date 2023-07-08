import { FC, useContext } from "react";
import { ShortcutCommand } from "../../../System/contextMenuCommands/shortcut-command";
import Image from 'next/image';
import { ProcessContext } from "../../../contexts/processContext";
import { StyledContextMenuShortcutCommands } from "../../../styled-components/system/context-menu/styled-context-menu-shortcut-commands";

export const ContextMenuShortcutCommandList: FC<{
  shortcutCommands: ShortcutCommand[]
}> = ({ shortcutCommands }) => {

  const { closeProcess } = useContext(ProcessContext);

  const handleCommandClick = (command: ShortcutCommand) => {
    if (!command) throw Error('No command to execute');

    command.execute();
    closeProcess('contextMenu');
  };

  return (
    <StyledContextMenuShortcutCommands>
      {
        shortcutCommands.map(command =>
          <div className="command" onClick={() => handleCommandClick(command)}>
            <Image
              key={"context-menu-shortcut-" + command.getName()}
              src={command.getIconPath()}
              alt={command.getName()}
              width={22}
              height={22}
            />
          </div>
          
        )
      }
    </StyledContextMenuShortcutCommands>
  );
};