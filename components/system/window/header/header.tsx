import Image from 'next/image';
import { FC } from "react";
import styles from './header.module.scss';
import {VscChromeMinimize,  VscChromeRestore, VscChromeMaximize, VscClose } from 'react-icons/vsc';
import { DEFAULT_FOLDER_ICON_PATH } from '../../../../services/desktopItemContainerService';

export type WindowHeaderOptions = {
  icon?: string;
  text?: string;
};

const HeaderComponent: FC<{
  selected: boolean,
  options: WindowHeaderOptions | undefined,
  maximized: boolean,
  startMovingWindow: (event: any) => void,
  maximizeWindow: (event: any) => void,
  onClose: () => void
}> = ({ selected, options, maximized, startMovingWindow, maximizeWindow, onClose }) => {
  
  const onMinimize = (event: any) => {
    console.log('minimize')
  };

  const getClass = () => {
    return `${styles.header} ${!selected ? styles.windowUnselectedHeader : ''}`;
  };

  return (
    <header
      className={getClass()}
    >
      <div className={styles.headerInfo}>
        {
          options?.icon &&
            <Image
              className={styles.icon}
              src={options?.icon} 
              alt={'window name'} 
              width={24} 
              height={24}
            />
        }

        {
          options?.text && 
            <div className={styles.text}>{ options.text }</div>
        }
      </div>
      

      {/* Empty box used to start moving window */}
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