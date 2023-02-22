import { FC, Fragment, useContext } from "react";
import { ProcessContext } from "../../../../contexts/processContext";
import { ContextMenuCommand } from "../../../../System/contextMenuCommands/abstractCommand";
import styles from '../contextMenu.module.scss';

const ContextMenuItemComponent : FC<{ command: ContextMenuCommand, handleMouseEnter: Function }> = ({ command: { text, callback, IconComponent }, handleMouseEnter }) => {

  const process = useContext(ProcessContext);

  const onClick = () => {
    const close = callback();

    if (close) {
      process.closeProcess('contextMenu');
    }
  };

  return (
    <div className={styles.contextMenuItem}>
       { IconComponent  && <div className={styles.commandIcon}> <IconComponent /> </div> }

       <div
        onMouseEnter={() => handleMouseEnter()}
        onClick={() => onClick()}
      >
        { text }
      </div>
    </div>
  
  );
};

export default ContextMenuItemComponent;