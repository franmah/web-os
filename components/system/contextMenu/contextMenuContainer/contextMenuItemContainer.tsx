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

  const handleMouseLeave = () => {
    clearTimeout(closeSubMenuTimeout)
    closeSubMenuTimeout = setTimeout(() => setIsHovering(() => false), 200);
  };

  return (
    <section
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseOver}
    >
      <div className={`${styles.contextMenuItem} ${isHovering ? styles.contextMenuContainerHovered : ''}`}>
       <div>{ command.text } </div> <div>{'>'}</div>
      </div>

       <div>
        {
          isHovering && 
          <ContextMenuComponent
            
            params={{
              top: 28,
              left: 247,
              commands: command.commands
            }}
          />
        } 
      </div>

    </section>
    
  );
};

export default ContextMenuItemContainerComponent;