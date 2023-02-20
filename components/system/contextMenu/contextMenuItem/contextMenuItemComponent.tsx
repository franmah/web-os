import { FC, useContext } from "react";
import { ProcessContext } from "../../../../contexts/processContext";
import { ContextMenuCommand } from "../../../../System/contextMenuCommands/abstractCommand";
import styles from '../contextMenu.module.scss';

const ContextMenuItemComponent : FC<{ command: ContextMenuCommand }> = ({ command }) => {
  const process = useContext(ProcessContext);

  const onClick = () => {
    const close = command.callback();

    if (close) {
      process.closeProcess('contextMenu');
    }
  }

  return (
    <div 
      onClick={() => onClick()}
      className={styles.contextMenuItem}
    >
      { command.text }
    </div>
  );
};

export default ContextMenuItemComponent;