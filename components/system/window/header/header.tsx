import Image from 'next/image';
import { FC, memo, useEffect, useState } from "react";
import styles from './header.module.scss';
import {VscChromeMinimize,  VscChromeRestore, VscChromeMaximize, VscClose } from 'react-icons/vsc';
import globalStyles from '../../../../styles/global.module.scss';
import { setMaximizeMenuListeners } from '../../../../services/system/window/WindowHeaderService';
import MaximizeOptionsModalComponent, { CustomMaximizeDirection } from '../maximizeOptionsModal/maximizeOptionsModal';
import { v4 } from 'uuid';
import { WindowMaximize } from '../../../../constants/system/window/WindowMaximizeEnum';
import { WindowHeaderProps } from '../../../../types/system/window/WindowHeaderProps';
import { CONTROL_ICON_SIZE, MAXIMIZE_DIV_ID } from '../../../../constants/system/window/WindowHeaderConts';

const HeaderComponent: FC<WindowHeaderProps> = memo(({
  selected,
  options, 
  maximized,
  startMovingWindow,
  maximizeWindow,
  onClose,
  moveToCustomMaximizeOptionClick
}) => {

  const [headerId] = useState<string>(v4());
  const [showMaximizeMenu, setShowMaximizeMenu] = useState<boolean>(false);
  
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
    setShowMaximizeMenu(false);
    moveToCustomMaximizeOptionClick(direction);
  };

  const onMaximizeIconClick = (event: React.MouseEvent) => {
    setShowMaximizeMenu(false);
    maximizeWindow(event);
  }

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
        <div
          onClick={onMaximizeIconClick}
          className={styles.maximizeIcon}
        >
          { 
            maximized === WindowMaximize.Full ? 
            <VscChromeRestore size={CONTROL_ICON_SIZE}/> :
            <VscChromeMaximize size={CONTROL_ICON_SIZE}/>
          }
        </div>

        { 
          showMaximizeMenu && 
          <div
            className={styles.maximizeOptionModal}
          > 
            <MaximizeOptionsModalComponent
              onCustomMaximizeClick={onCustomMaximizeClick}
            />
          </div> 
        }
      </div>

      <div
        className={styles.closeIcon}
        onClick={onClose}
      > 
        <VscClose size={CONTROL_ICON_SIZE}/> 
      </div>

    </header>
  )
}, (state1, state2) => 
  state1.selected === state2.selected &&
  state1.options?.icon === state2.options?.icon &&
  state1.options?.text === state2.options?.text &&
  state1.maximized === state2.maximized
);

export default HeaderComponent;