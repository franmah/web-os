import { FC, useEffect, useState } from 'react';
import ContextMenuCommandContainer from '../../../System/contextMenuCommands/abstractCommandContainer';
import { ContextMenuParams } from '../../../types/system/contextMenu/contextMenuParams';
import styles from './contextMenu.module.scss';
import ContextMenuItemCommandContainerComponent from './contextMenuContainer/contextMenuItemContainerComponent';
import ContextMenuItemComponent from './contextMenuItem/contextMenuItemComponent';

export const SMALL_WIDTH_SUB_MENU = 100;
export const MEDIUM_WIDTH_SUB_MENU = 250;
export const DEFAULT_WIDTH_SUB_MENU = MEDIUM_WIDTH_SUB_MENU;

const HOVERING_TIMEOUT = 300;

const ContextMenuComponent: FC<{ params: ContextMenuParams }> = ({ params: { top, left, width, commands } }) => {

  let closeSubMenuTimeout: NodeJS.Timeout;

  // TODO: merge these two into a subMenu type or something
  const [isHoveringItemContainer, setIsHovering] = useState<{ id: string }>({ id: '' });
  const [subMenuPosition, setSubMenuPositionState] = useState<{ top: number, left: number, width: number }>({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    return () => clearTimeout(closeSubMenuTimeout);
  }, []);

  // Prevent menu from closing when clicking
  const onMouseDown = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const setSubMenuPosition = (containerParams: any) => {
    // TODO: move logic to its own function
    const updatedLeft = containerParams.left + containerParams.width + left > window.innerWidth ?
      containerParams.left - containerParams.width :
      containerParams.left;
    setSubMenuPositionState(() => ({ top: containerParams.top, left: updatedLeft, width: containerParams.width }));
  }

  /**
   * @param containerId
   * @param top, left, width: commandContainerItemComponent's position.
   */
  const handleMouseEnterContainer = (containerId: string, top: number, left: number, width: number) => {
    clearTimeout(closeSubMenuTimeout);
    closeSubMenuTimeout = setTimeout(() => {
      setIsHovering(() => ({ id: containerId }));
      setSubMenuPosition({ top, left, width });
    }, HOVERING_TIMEOUT);
  };

  const handleMouseEnterItem = () => {
    clearTimeout(closeSubMenuTimeout);
    closeSubMenuTimeout = setTimeout(() => setIsHovering(() => ({ id: '' })), HOVERING_TIMEOUT);
  };

  return (
    <section
      onMouseDown={onMouseDown}
      className={styles.contextMenu}
      style={{
        top,
        left,
        width: width || DEFAULT_WIDTH_SUB_MENU
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
              {
                isHoveringItemContainer.id === command.id &&
                <ContextMenuComponent
                  params={{
                    top: subMenuPosition.top,
                    left: subMenuPosition.left,
                    width: subMenuPosition.width,
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
