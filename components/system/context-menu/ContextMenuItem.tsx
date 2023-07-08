import { FC, useContext } from "react";
import { ProcessContext } from "../../../contexts/ProcessContext";
import { ContextMenuCommand } from "../../../System/context-menu-commands/AbstractCommand";
import styles from './context-menu.module.scss';
import { CONTEXT_MENU_ITEM_HEIGHT } from "./ContextMenu";

const ContextMenuItemComponent : FC<{
  command: ContextMenuCommand,
  handleMouseEnter: () => void 
}> = ({ command: { execute, text, IconComponent }, handleMouseEnter }) => {

  const process = useContext(ProcessContext);

  const onClickEvent = (execute: Function) => {
    const close = execute();

    if (close) {
      process.closeProcess('contextMenu');
    }
  };

  return (
    <div 
      className={styles.contextMenuItem}
      onMouseOver={handleMouseEnter}
      onClick={() => onClickEvent(execute)}
      style={{ height: `${CONTEXT_MENU_ITEM_HEIGHT}px`}}
    >
       { IconComponent  && <div className={styles.commandIcon}> <IconComponent /> </div> }

      <div>
        { text }
      </div>
    </div>
  
  );
};

export default ContextMenuItemComponent;