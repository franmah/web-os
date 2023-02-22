import { FC, useEffect, useState } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";
import { MdKeyboardArrowRight } from 'react-icons/md';
import ContextMenuComponent from "../contextMenuComponent";
import { correctSubMenuPosition } from "../../../../services/contextMenuService";

const ContextMenuItemCommandContainerComponent : FC<{ 
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
    const subMenuLeft = element.offsetLeft + element.offsetWidth;

    // Prevent from going to far right
    const updatedLeft = correctSubMenuPosition(subMenuLeft, subMenuWidth, element.parentElement.offsetLeft);

    setSubMenuPosition({
      top,
      left:updatedLeft,
      width: subMenuWidth,
    });
  }, [showSubMenu]);

  return (
    <section
      id={id}
      onMouseEnter={() => handleMouseEnter(id)}
      className={`
        ${styles.contextMenuItemContainer} 
        ${showSubMenu ? styles.contextMenuContainerHovered : ''}
      `}
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

export default ContextMenuItemCommandContainerComponent;