import { FC, useContext } from "react";
import { ShortcutCommand } from "../../../System/contextMenuCommands/shortcut-command";
import Image from 'next/image';
import styled from "styled-components";
import { ProcessContext } from "../../../contexts/processContext";

export const StyledContextMenuShortcutCommands = styled.section`
  width: 100%;
  display: flex;
  padding: .5em;

  .command {
    padding: 4px;
    margin-right: .5em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    
    &:hover {
      background-color: #EFEFEF;
    }
  }
`;

export const ContextMenuShortcutCommandsComponent: FC<{
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
              key={command.getName()}
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