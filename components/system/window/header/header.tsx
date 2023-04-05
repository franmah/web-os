import Image from 'next/image';
import { FC, useState } from "react";
import styles from './header.module.scss';
import {VscChromeMinimize, VscClose } from 'react-icons/vsc';
import globalStyles from '../../../../styles/global.module.scss';
import { v4 } from 'uuid';
import { WindowMaximize } from '../../../../constants/system/window/WindowMaximizeEnum';
import { WindowHeaderProps } from '../../../../types/system/window/WindowHeaderProps';
import { CONTROL_ICON_SIZE, MAXIMIZE_DIV_ID } from '../../../../constants/system/window/WindowHeaderConts';
import { HeaderMaximizeButtonComponent } from '../headerMaximizeButton/headerMaximizeButtonComponent';

const HeaderComponent: FC<WindowHeaderProps> = ({
  focused,
  options, 
  maximized,
  startMovingWindow,
  maximizeWindow,
  onClose,
  moveToCustomMaximizeOptionClick
}) => {

  const [headerId] = useState<string>(v4());
  
  const onMinimize = (event: any) => {
    console.log('minimize');
  };


  const getClass = () => {
    return `
      ${styles.header} 
      ${!focused ? styles.windowUnfocusedHeader : ''} 
      ${globalStyles.unselectableText}
    `;
  };

  return (
    <header
      className={getClass()}
    >
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

      <div 
        className={styles.textContainer}
        onMouseDown={startMovingWindow}
        onDoubleClick={maximizeWindow}
      >
        { options?.text }
      </div>
         
      <div 
        className={styles.minimizeIcon}
        onClick={onMinimize}
      > 
        <VscChromeMinimize size={CONTROL_ICON_SIZE}/>
      </div>

      <div 
        className={styles.maximizeContainer}
        id={MAXIMIZE_DIV_ID + '_' + headerId}
      >
        <HeaderMaximizeButtonComponent
          maximized={maximized}
          maximizeButtonHtmlId={MAXIMIZE_DIV_ID + '_' + headerId}
          moveToCustomMaximizeOptionClick={moveToCustomMaximizeOptionClick}
          maximizeWindow={maximizeWindow}   
        />
      </div>

      <div
        className={styles.closeIcon}
        onClick={onClose}
      > 
        <VscClose size={CONTROL_ICON_SIZE}/> 
      </div>

    </header>
  )
};

export default HeaderComponent;