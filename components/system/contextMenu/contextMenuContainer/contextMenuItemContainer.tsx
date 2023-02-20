import { FC, useState } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";
import ContextMenuComponent from "../contextMenuComponent";

const ContextMenuItemContainerComponent : FC<{ command: ContextMenuCommandContainer }> = ({ command }) => {

  const [isHovering, setIsHovering] = useState(false);

  let closeSubMenuTimeout: NodeJS.Timeout;

  const handleMouseOver = () => {
    clearTimeout(closeSubMenuTimeout);
    setIsHovering(() => true);
  };

  const handleMouseOut = () => {
    clearTimeout(closeSubMenuTimeout)
    closeSubMenuTimeout = setTimeout(() => setIsHovering(() => false), 200);
  };

  return (
    <section
      onMouseLeave={handleMouseOut}
      onMouseOver={handleMouseOver}
    >
      <div className={styles.contextMenuItem}>
       <div>{ command.text } </div> <div>{'>'}</div>
      </div>

      {
        isHovering && 
        <ContextMenuComponent
          params={{
            top: 0,
            left: 200,
            commands: command.commands
          }}
        />
      }

    </section>
    
  );
};

export default ContextMenuItemContainerComponent;