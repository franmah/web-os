import { FC } from "react";
import styles from './header.module.scss';
import {VscChromeMinimize,  VscChromeRestore, VscChromeMaximize, VscClose } from 'react-icons/vsc';

const HeaderComponent: FC<{
  maximized: boolean,
  onHeaderMouseDown: (event: any) => void,
  maximizeWindow: (event: any) => void,
}> = ({ maximized, onHeaderMouseDown, maximizeWindow }) => {
  
  const onMinimize = (event: any) => {
    console.log('minimize')
  };

  const onClose = (event: any) => {
    console.log('close')
  };

  return (
    <header
      className={styles.header}
    >
      <div 
        className={styles.moveContainer}
        onMouseDown={onHeaderMouseDown}
        onDoubleClick={maximizeWindow}
      ></div>
         
      <div 
        className={styles.minimize}
        onClick={onMinimize}
      > 
        <VscChromeMinimize/>
      </div>

      <div 
        className={styles.maximize}
        onClick={maximizeWindow}
      >
        { maximized ? <VscChromeRestore/> : <VscChromeMaximize/> }
      </div>

      <div
        className={styles.close}
        onClick={onClose}
      > 
        <VscClose/> 
      </div>

    </header>
  )
};

export default HeaderComponent;