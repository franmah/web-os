import { FC } from "react";
import styles from './header.module.scss';
import {VscChromeMinimize,  VscChromeRestore, VscChromeMaximize, VscClose } from 'react-icons/vsc';

const HeaderComponent: FC<{
  maximized: boolean,
  startMovingWindow: (event: any) => void,
  maximizeWindow: (event: any) => void,
  onClose: () => void
}> = ({ maximized, startMovingWindow, maximizeWindow, onClose }) => {

  const onMinimize = (event: any) => {
    console.log('minimize')
  };

  return (
    <header
      className={styles.header}
    >
      <div 
        className={styles.moveContainer}
        onMouseDown={startMovingWindow}
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