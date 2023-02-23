import { FC, useContext } from "react";
import { ProcessContext } from "../../../../contexts/processContext";
import { ContextMenuCommand } from "../../../../System/contextMenuCommands/abstractCommand";
import styles from '../contextMenu.module.scss';
import { CONTEXT_MENU_ITEM_HEIGHT } from "../contextMenuComponent";

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