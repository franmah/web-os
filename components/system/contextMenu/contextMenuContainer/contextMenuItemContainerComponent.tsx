import { FC } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";
import { MdKeyboardArrowRight } from 'react-icons/md';

const ContextMenuItemCommandContainerComponent : FC<{ 
  command: ContextMenuCommandContainer
  handleMouseEnter: (id: string, top: number, left: number, width: number) => void,
  isHovered: boolean,
  children: any 
}> = ({ command: { id, text, subMenuWidth, IconComponent }, handleMouseEnter, isHovered, children }) => {

  const handleMouseOver = () => {
    const element = document.getElementById(id);

    if (!element) {
      return handleMouseEnter(id, 0, 0, 0);
    }

    const top = element.offsetTop;
    const subMenuLeft = element.offsetLeft + element.offsetWidth;

    handleMouseEnter(id, top, subMenuLeft, subMenuWidth);
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
        { 
          IconComponent && 
          <div className={styles.commandIcon}> <IconComponent /> </div> 
        }
        { text }
      </div>
      
      <MdKeyboardArrowRight className={styles.containerArrowIcon}/>

      {/* sub-context menu*/}
      { children }
    </section>
    
  );
};

export default ContextMenuItemCommandContainerComponent;