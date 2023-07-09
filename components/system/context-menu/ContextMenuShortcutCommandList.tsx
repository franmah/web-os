import { FC, useContext } from 'react';
import { ShortcutCommand } from '../../../System/context-menu-commands/ShortcutCommand';
import Image from 'next/image';
import { ProcessContext } from '../../../contexts/ProcessContext';
import { StyledContextMenuShortcutCommands } from '../../../styled-components/system/context-menu/StyledContextMenuShortcutCommands';

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
          <div
            className="command" onClick={() => handleCommandClick(command)}
            key={'context-menu-shortcut-' + command.getName()}
          >
            <Image
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