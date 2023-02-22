import { FC, useEffect, useState } from 'react';
import ContextMenuCommandContainer from '../../../System/contextMenuCommands/abstractCommandContainer';
import { ContextMenuParams } from '../../../types/system/contextMenu/contextMenuParams';
import styles from './contextMenu.module.scss';
import ContextMenuItemCommandContainerComponent from './contextMenuContainer/contextMenuItemContainer';
import ContextMenuItemComponent from './contextMenuItem/contextMenuItemComponent';

const HOVERING_TIMEOUT = 300;

const ContextMenuComponent: FC<{ params: ContextMenuParams }> = ({ 
  params: { 
    left,
    top,
    commands
  }
}) => {

  let closeSubMenuTimeout: NodeJS.Timeout;

  const [isHoveringItemContainer, setIsHovering] = useState<{ id: string }>({ id: '' });
  const [subMenu, setSubMenu] = useState();

  useEffect(() => {
    return () => clearTimeout(closeSubMenuTimeout);
  }, []);

  // Prevent menu from closing when clicking
  const onMouseDown = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const handleMouseEnterContainer = (id: string) => {
    clearTimeout(closeSubMenuTimeout);
    closeSubMenuTimeout = setTimeout(() => setIsHovering(() => ({ id })), HOVERING_TIMEOUT);
  };

  const handleMouseEnterItem = () => {
    clearTimeout(closeSubMenuTimeout);
    closeSubMenuTimeout = setTimeout(() => setIsHovering(() => ({ id: '' })), HOVERING_TIMEOUT);
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
        commands.map((command, index) => 
          command instanceof ContextMenuCommandContainer ?
            <ContextMenuItemCommandContainerComponent 
              key={index}
              command={command as any}
              isHovered={isHoveringItemContainer.id === command.id}
              handleMouseEnter={handleMouseEnterContainer}
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
            </ContextMenuItemCommandContainerComponent>
           
            :

            <ContextMenuItemComponent
              key={index}
              command={command as any}
              handleMouseEnter={handleMouseEnterItem}
            />
        )
      }

    </section>
  );
};

export default ContextMenuComponent;
