import { FC, useEffect, useState } from 'react';
import { WindowMaximize } from '../../../../constants/system/window/WindowMaximizeEnum';
import { VscChromeMaximize, VscChromeRestore } from 'react-icons/vsc';
import { CONTROL_ICON_SIZE } from '../../../../constants/system/window/WindowHeader';
import MaximizeOptionsModal from '../maximizeOptionsModal/MaximizeOptionsModal';
import { setMaximizeMenuListeners } from '../../../../services/system/window/WindowHeaderService';
import { StyledHeaderMaximizedIconContainer } from '../../../../styled-components/system/window/StyledHeaderMaximizedIconContainer';
import { StyledHeaderMaximizeOptionsModalContainer } from '../../../../styled-components/system/window/StyledMaximizeOptionsModalContainer';
import { CustomMaximizeDirection } from '../../../../constants/system/window/CustomMaximizeDirectionEnum';

export const HeaderMaximizeButton: FC<{
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
    };
  }, [maximizeButtonHtmlId]);

  const onCustomMaximizeClick = (direction: CustomMaximizeDirection) => {
    setShowMaximizeMenu(false);
    moveToCustomMaximizeOptionClick(direction);
  };

  const onMaximizeIconClick = (event: React.MouseEvent) => {
    setShowMaximizeMenu(false);
    maximizeWindow(event);
  };

  return (
    <>
      <StyledHeaderMaximizedIconContainer
        onClick={onMaximizeIconClick}
      >
        {
          maximized === WindowMaximize.Full ?
          <VscChromeRestore size={CONTROL_ICON_SIZE}/> :
          <VscChromeMaximize size={CONTROL_ICON_SIZE}/>
        }
      </StyledHeaderMaximizedIconContainer>

      {
        showMaximizeMenu &&
        <StyledHeaderMaximizeOptionsModalContainer>
          <MaximizeOptionsModal
            onCustomMaximizeClick={onCustomMaximizeClick}
          />
        </StyledHeaderMaximizeOptionsModalContainer>
      }
    </>
  );
};