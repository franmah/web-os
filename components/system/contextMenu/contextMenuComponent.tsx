import { FC, useState } from 'react';
import ContextMenuCommandContainer from '../../../System/contextMenuCommands/abstractCommandContainer';
import { ContextMenuParams } from '../../../types/system/contextMenu/contextMenuParams';
import styles from './contextMenu.module.scss';
import ContextMenuItemContainerComponent from './contextMenuContainer/contextMenuItemContainer';
import ContextMenuItemComponent from './contextMenuItem/contextMenuItemComponent';

const ContextMenuComponent: FC<{ params: ContextMenuParams }> = ({ params: { left, top, commands} }) => {

  // Prevent menu from closing when clicking
  const onMouseDown = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  let closeSubMenuTimeout: NodeJS.Timeout;


  const [isHoveringItemContainer, setIsHovering] = useState<{ id: string }>({ id: '' });

  const onMouseOverContainer = (id: string) => {
    clearTimeout(closeSubMenuTimeout);
    closeSubMenuTimeout = setTimeout(() => setIsHovering(() => ({ id })), 400);
  };

  const handleMouseEnterItem = () => {
    clearTimeout(closeSubMenuTimeout);
    closeSubMenuTimeout = setTimeout(() => setIsHovering(() => ({ id: '' })), 400);
  }

  return (
    <section
      onMouseDown={onMouseDown}
      className={styles.contextMenu}
      style={{
        top: top,
        left: left
      }}
    >
      {
        commands.map((command, index) => {
          return command instanceof ContextMenuCommandContainer ?
            <ContextMenuItemContainerComponent 
              key={index} command={command as any}
              onMouseOver={onMouseOverContainer}
            >
              { isHoveringItemContainer.id === command.id && 
                <ContextMenuComponent  
                  params={{
                    top: 50,
                    left: 180,
                    commands: command.commands
                  }}
                />
              }
            </ContextMenuItemContainerComponent>
              :
            <ContextMenuItemComponent
              key={index}
              command={command as any}
              handleMouseEnter={handleMouseEnterItem}
            />
          }
        )
      }

    </section>
  );
};

export default ContextMenuComponent;