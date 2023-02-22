import { FC } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";
import { MdKeyboardArrowRight } from 'react-icons/md';

const ContextMenuItemCommandContainerComponent : FC<{ 
  command: ContextMenuCommandContainer
  handleMouseEnter: Function,
  isHovered: boolean,
  children: any 
}> = ({ command, handleMouseEnter, isHovered, children }) => {

  const IconComponent = command.icon;

  // TODO: pass top and right to parent so they can start the menu
  const handleMouseOver = () => {
    const element = document.getElementById(command.id);

    if (!element) return;

    const top = element.offsetTop;
    const right = element.offsetLeft + element.offsetWidth;

    handleMouseEnter(command.id, command.text);
  };

  return (
    <section
      id={command.id}
      onMouseEnter={handleMouseOver}
      className={`
        ${styles.contextMenuItemContainer} 
        ${isHovered ? styles.contextMenuContainerHovered : ''}
      `}
    >
      <div className={styles.commandInfo}>
        { IconComponent && <div className={styles.commandIcon}> <IconComponent /> </div> }
        { command.text }
      </div>
      
      <MdKeyboardArrowRight className={styles.containerArrowIcon}/>

      {/* sub-context menu*/}
      { children }
    </section>
    
  );
};

export default ContextMenuItemCommandContainerComponent;