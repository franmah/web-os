import { FC } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";
import { MdKeyboardArrowRight } from 'react-icons/md';

const ContextMenuItemCommandContainerComponent : FC<{ 
  command: ContextMenuCommandContainer
  handleMouseEnter: Function,
  isHovered: boolean,
  children: any 
}> = ({ command: {id, text, IconComponent}, handleMouseEnter, isHovered, children }) => {

  const handleMouseOver = () => {
    const element = document.getElementById(id);

    if (!element) {
      return handleMouseEnter(id, text);
    }

    const top = element.offsetTop;
    const right = element.offsetLeft + element.offsetWidth;

    handleMouseEnter(id, text);
  };

  return (
    <section
      id={id}
      onMouseEnter={handleMouseOver}
      className={`
        ${styles.contextMenuItemContainer} 
        ${isHovered ? styles.contextMenuContainerHovered : ''}
      `}
    >
      <div className={styles.commandInfo}>
        { IconComponent && <div className={styles.commandIcon}> <IconComponent /> </div> }
        { text }
      </div>
      
      <MdKeyboardArrowRight className={styles.containerArrowIcon}/>

      {/* sub-context menu*/}
      { children }
    </section>
    
  );
};

export default ContextMenuItemCommandContainerComponent;