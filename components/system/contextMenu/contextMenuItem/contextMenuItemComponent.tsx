import { FC, Fragment, useContext } from "react";
import { ProcessContext } from "../../../../contexts/processContext";
import { ContextMenuCommand } from "../../../../System/contextMenuCommands/abstractCommand";
import styles from '../contextMenu.module.scss';

const ContextMenuItemComponent : FC<{
  command: ContextMenuCommand,
  handleMouseEnter: () => void 
}> = ({ command: { text, callback, IconComponent }, handleMouseEnter }) => {

  const process = useContext(ProcessContext);

  const onClick = () => {
    const close = callback();

    if (close) {
      process.closeProcess('contextMenu');
    }
  };

  return (
    <div 
      className={styles.contextMenuItem}
      onMouseOver={handleMouseEnter}
      onClick={() => onClick()}
    >
       { IconComponent  && <div className={styles.commandIcon}> <IconComponent /> </div> }

      <div
        onMouseOver={handleMouseEnter}
        onClick={() => onClick()}
      >
        { text }
      </div>
    </div>
  
  );
};

export default ContextMenuItemComponent;