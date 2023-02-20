import { FC, useEffect } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";

const ContextMenuItemCommandContainerComponent : FC<{ 
  command: ContextMenuCommandContainer
  handleMouseEnter: Function,
  children: any }> = 
({ command, handleMouseEnter, children }) => {

    // TODO: delete
  useEffect(() => {
    const element = document.getElementById(command.id);

    if (!element) return;

    const top = element.offsetTop;
    const right = element.offsetLeft + element.offsetWidth;
  }, []);

  const handleMouseOver = () => {
    handleMouseEnter(command.id, command.text);
  };

  return (
    <section
      id={command.id}
      onMouseEnter={handleMouseOver}
      className={styles.contextMenuItem}
    >
      <div>{ command.text } </div> <div>{'>'}</div>
      { children }
    </section>
    
  );
};

export default ContextMenuItemCommandContainerComponent;