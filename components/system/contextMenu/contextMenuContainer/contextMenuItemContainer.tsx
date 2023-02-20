import { FC, useEffect, useState } from "react";
import styles from '../contextMenu.module.scss';
import ContextMenuCommandContainer from "../../../../System/contextMenuCommands/abstractCommandContainer";
import ContextMenuComponent from "../contextMenuComponent";
import { v4 as uuidv4 } from 'uuid';

const HOVERING_TIMEOUT = 200;

const ContextMenuItemContainerComponent : FC<{ 
  command: ContextMenuCommandContainer
  onMouseOver: Function,
  children: any }> = 
({ command, onMouseOver, children }) => {

    // TODO: delete
  useEffect(() => {
    const element = document.getElementById(command.id);

    if (!element) return;

    const top = element.offsetTop;
    const right = element.offsetLeft + element.offsetWidth;
  }, []);

  const handleMouseOver = () => {
    onMouseOver(command.id, command.text);
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

export default ContextMenuItemContainerComponent;