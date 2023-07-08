import { FC, useEffect, useState } from 'react';
import ContextMenuCommandContainer from '../../../System/context-menu-commands/AbstractCommandContainer';
import { ContextMenuParams } from '../../../types/system/contextMenu/contextMenu';
import styles from './context-menu.module.scss';
import ContextMenuItemCommandContainer from './ContextMenuItemContainer';
import ContextMenuItemComponent from './ContextMenuItem';
import { ContextMenuShortcutCommandList } from './ContextMenuShortcutCommandList';

export const SMALL_WIDTH_SUB_MENU = 100;
export const MEDIUM_WIDTH_SUB_MENU = 250;
export const DEFAULT_WIDTH_SUB_MENU = MEDIUM_WIDTH_SUB_MENU;
export const CONTEXT_MENU_ITEM_HEIGHT = 21;

const HOVERING_TIMEOUT = 300;

const ContextMenuComponent: FC<{ params: ContextMenuParams }> = ({
  params: { top, left, width, commands, shortcutCommands = [] }
}) => {

  let closeSubMenuTimeout: NodeJS.Timeout;

  const [hoveredContainerId, setHoveredContainerId] = useState<string>('');

  useEffect(() => {
    return () => clearTimeout(closeSubMenuTimeout);
  }, []);

  const handleMouseEnterContainer = (containerId: string) => {
    clearTimeout(closeSubMenuTimeout);
    closeSubMenuTimeout = setTimeout(() => {
      setHoveredContainerId(() => (containerId));
    }, HOVERING_TIMEOUT);
  };

  const handleMouseEnterItem = () => {
    clearTimeout(closeSubMenuTimeout);
    closeSubMenuTimeout = setTimeout(() => setHoveredContainerId(() => ('')), HOVERING_TIMEOUT);
  };

  return (
    <section
      className={styles.contextMenu}
      style={{
        top,
        left,
        width: width || DEFAULT_WIDTH_SUB_MENU,
        zIndex: 10000
      }}
    >
      { 
        shortcutCommands.length > 0 ?
        <>
          <ContextMenuShortcutCommandList
            shortcutCommands={shortcutCommands}
          />

          <div className={styles.divider}></div>
        </>
           :
          null
      }
      
      {
        commands.map((command, index) =>
          command instanceof ContextMenuCommandContainer ?

            <ContextMenuItemCommandContainer
              key={index}
              command={command as any}
              showSubMenu={hoveredContainerId === command.id}
              handleMouseEnter={handleMouseEnterContainer}
            />
           
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
