import { FC, useEffect } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";

const ContextMenuItemCommandContainerComponent : FC<{ 
  command: ContextMenuCommandContainer
  handleMouseEnter: Function,
  isHovered: boolean,
  children: any 
}> = ({ command, handleMouseEnter, isHovered, children }) => {

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
        ${styles.contextMenuItem} 
        ${isHovered ? styles.contextMenuContainerHovered : ''}
      `}
    >
      <div>{ command.text } </div> <div>{'>'}</div>
      { children }
    </section>
    
  );
};

export default ContextMenuItemCommandContainerComponent;