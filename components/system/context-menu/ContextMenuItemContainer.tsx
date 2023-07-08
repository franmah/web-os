import { FC, useEffect, useState } from "react";
import styles from './context-menu.module.scss';
import ContextMenuCommandContainer from "../../../System/contextMenuCommands/abstractCommandContainer";
import { MdKeyboardArrowRight } from 'react-icons/md';
import ContextMenuComponent, { CONTEXT_MENU_ITEM_HEIGHT as CONTEXT_MENU_ITEM_HEIGHT } from "./ContextMenu";
import { correctSubMenuLeftPosition, correctSubMenuTopPosition } from "../../../services/contextMenuService";

const ContextMenuItemCommandContainer : FC<{
  command: ContextMenuCommandContainer
  handleMouseEnter: (id: string) => void,
  showSubMenu: boolean,
}> = ({ command: { id, text, subMenuWidth, IconComponent, commands }, handleMouseEnter, showSubMenu }) => {

  const [subMenuPosition, setSubMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const element = document.getElementById(id);

    if (!element || !element?.parentElement) {
      return handleMouseEnter(id);
    }

    const top = element.offsetTop;
    const left = element.offsetLeft + element.offsetWidth;

    const absolutePosition = element.getBoundingClientRect();

    const updatedLeft = correctSubMenuLeftPosition(left, subMenuWidth, absolutePosition.left);
    const updatedTop = correctSubMenuTopPosition(top, commands.length || 0, absolutePosition.top);

    setSubMenuPosition({
      top: updatedTop,
      left:updatedLeft,
      width: subMenuWidth,
    });
  }, [showSubMenu]);

  return (
    <section
      id={id}
      onMouseEnter={() => handleMouseEnter(id)}
      className={
        `${styles.contextMenuItemContainer}` + ' ' +
        `${showSubMenu ? styles.contextMenuContainerHovered : ''}`
      }
      style={{ height: `${CONTEXT_MENU_ITEM_HEIGHT}px`}}
    >

      <div className={styles.commandInfo}>
        { 
          IconComponent && 
          <div className={styles.commandIcon}> <IconComponent /> </div> 
        }
        { text }
      </div>
      
      <MdKeyboardArrowRight className={styles.containerArrowIcon}/>

      {
        showSubMenu &&
        <ContextMenuComponent
          params={{
            top: subMenuPosition.top,
            left: subMenuPosition.left,
            width: subMenuPosition.width,
            commands: commands
          }}
        />
      }
    
    </section>
  );
};

export default ContextMenuItemCommandContainer;