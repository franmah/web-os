import { FC } from 'react';
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

  return (
    <section
      onMouseDown={onMouseDown}
      className={styles.contextMenu}
      style={{
        position: 'absolute',
        top: top,
        left: left
      }}
    >
      {
        commands.map((command, index) => 
          command instanceof ContextMenuCommandContainer ?
            <ContextMenuItemContainerComponent key={index} command={command as any} /> :
            <ContextMenuItemComponent key={index} command={command as any}/>
        )
      }
    </section>
  );
};

export default ContextMenuComponent;