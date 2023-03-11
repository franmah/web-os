import Image from 'next/image';
import { FC, useEffect, useState } from "react";
import styles from './header.module.scss';
import {VscChromeMinimize,  VscChromeRestore, VscChromeMaximize, VscClose } from 'react-icons/vsc';
import globalStyles from '../../../../styles/global.module.scss';
import { setMaximizeMenuListeners } from '../../../../services/WindowHeaderService';
import MaximizeOptionsModalComponent, { CustomMaximizeDirection } from '../maximizeOptions/maximizeOptionsModal';

export type WindowHeaderOptions = {
  icon?: string;
  text?: string;
};

const MAXIMIZE_DIV_ID = 'maximizeHeaderDiv';

const HeaderComponent: FC<{
  selected: boolean,
  options: WindowHeaderOptions | undefined,
  maximized: boolean,
  headerId: string,
  startMovingWindow: (event: any) => void,
  maximizeWindow: (event: any) => void,
  onClose: () => void,
}> = ({ selected, options, maximized, headerId, startMovingWindow, maximizeWindow, onClose }) => {

  const [showMaximizeMenu, setShowMaximizeMenu] = useState<boolean>(true);
  
  const onMinimize = (event: any) => {
    console.log('minimize');
  };

  useEffect(() => {
    const cleanup = setMaximizeMenuListeners(`${MAXIMIZE_DIV_ID}_${headerId}`, setShowMaximizeMenu);
    return () => {
      if (cleanup) 
        cleanup();
    }
  });

  const onCustomMaximizeClick = (direction: CustomMaximizeDirection) => {
    console.log(direction);
  };

  const getClass = () => {
    return `
      ${styles.header} 
      ${!selected ? styles.windowUnselectedHeader : ''} 
      ${globalStyles.unselectableText}
    `;
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
        id={MAXIMIZE_DIV_ID + '_' + headerId}
      >
        { maximized ? <VscChromeRestore/> : <VscChromeMaximize/> }
        { showMaximizeMenu && 
          <div className={styles.maximizeOptionModal}> 
            <MaximizeOptionsModalComponent
              onCustomMaximizeClick={onCustomMaximizeClick}
            />
          </div> 
        }
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