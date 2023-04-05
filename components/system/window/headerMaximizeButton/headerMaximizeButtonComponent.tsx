import { FC, useEffect, useState } from "react";
import { WindowMaximize } from "../../../../constants/system/window/WindowMaximizeEnum";
import { VscChromeMaximize, VscChromeRestore } from "react-icons/vsc";
import { CONTROL_ICON_SIZE } from "../../../../constants/system/window/WindowHeaderConts";
import MaximizeOptionsModalComponent, { CustomMaximizeDirection } from "../maximizeOptionsModal/maximizeOptionsModal";
import { setMaximizeMenuListeners } from '../../../../services/system/window/WindowHeaderService';
import styles from './headerMaximizeButton.module.scss';

export const HeaderMaximizeButtonComponent: FC<{
  maximized: WindowMaximize,
  maximizeButtonHtmlId: string,
  moveToCustomMaximizeOptionClick: (direction: CustomMaximizeDirection) => void,
  maximizeWindow: (event: any) => void,
}> = ({
  maximized,
  maximizeButtonHtmlId,
  moveToCustomMaximizeOptionClick,
  maximizeWindow
}) => {
  
  const [showMaximizeMenu, setShowMaximizeMenu] = useState<boolean>(false);

  useEffect(() => {
    const cleanupFunction = setMaximizeMenuListeners(maximizeButtonHtmlId, setShowMaximizeMenu);
    return () => {
      if (cleanupFunction) 
        cleanupFunction();
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

  return (
    <>
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
    </>
  );
};