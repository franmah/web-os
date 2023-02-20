import { FC, useEffect, useState } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";
import ContextMenuComponent from "../contextMenuComponent";
import { v4 as uuidv4 } from 'uuid';

const HOVERING_TIMEOUT = 200;

const ContextMenuItemContainerComponent : FC<{ command: ContextMenuCommandContainer }> = ({ command }) => {

  const id = uuidv4();

  const [isHovering, setIsHovering] = useState(false);
  const [itemPositionInMenu, setPosition] = useState({ top: 0, right: 0});

  let closeSubMenuTimeout: NodeJS.Timeout;

  useEffect(() => {
    const element = document.getElementById(id);

    if (!element) return;

    const top = element.offsetTop;
    const right = element.offsetLeft + element.offsetWidth;
    setPosition(() => ({ top, right }));
  }, []);


  const handleMouseOver = () => {
    clearTimeout(closeSubMenuTimeout);
    setTimeout(() => setIsHovering(() => true), HOVERING_TIMEOUT);
  };

  const handleMouseLeave = () => {
    clearTimeout(closeSubMenuTimeout)
    closeSubMenuTimeout = setTimeout(() => setIsHovering(() => false), HOVERING_TIMEOUT);
  };

  return (
    <section
      id={id}
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
              top: itemPositionInMenu.top,
              left: itemPositionInMenu.right,
              commands: command.commands
            }}
          />
        } 
      </div>

    </section>
    
  );
};

export default ContextMenuItemContainerComponent;