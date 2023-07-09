import { FC, useState } from 'react';
import {VscChromeMinimize, VscClose } from 'react-icons/vsc';
import globalStyles from '../../../../styles/global.module.scss';
import { v4 } from 'uuid';
import { WindowHeaderProps } from '../../../../types/system/window/WindowHeaderProps';
import { CONTROL_ICON_SIZE, MAXIMIZE_DIV_PRE_ID } from '../../../../constants/system/window/WindowHeader';
import { HeaderMaximizeButton } from '../header-maximize-button/HeaderMaximizeButton';
import { WindowHeaderInformation } from '../header-information/HeaderInformation';
import { StyledWindowHeader } from '../../../../styled-components/system/window/StyledWindowHeader';

const WindowHeader: FC<WindowHeaderProps> = ({
  focused,
  options,
  maximized,
  startMovingWindow,
  maximizeWindow,
  onClose,
  moveToCustomMaximizeOptionClick
}) => {

  const [headerId] = useState<string>(v4());

  const maximizeButtonDivID = MAXIMIZE_DIV_PRE_ID + '_' + headerId;

  const onMinimize = () => {
    console.log('minimize');
  };

  return (
    <StyledWindowHeader
      focused={focused}
      className={globalStyles.unselectableText}
    >
      <WindowHeaderInformation
        options={options}
        focused={focused}
        startMovingWindow={startMovingWindow}
        maximizeWindow={maximizeWindow}
      />

      <div
        className='minimizeIcon'
        onClick={onMinimize}
      >
        <VscChromeMinimize size={CONTROL_ICON_SIZE}/>
      </div>

      {/* MAXIMIZE ICON BUTTON */}
      <div
        className='maximizeContainer'
        id={maximizeButtonDivID}
      >
        <HeaderMaximizeButton
          maximized={maximized}
          maximizeButtonHtmlId={maximizeButtonDivID}
          moveToCustomMaximizeOptionClick={moveToCustomMaximizeOptionClick}
          maximizeWindow={maximizeWindow}
        />
      </div>

      <div
        className='closeIcon'
        onClick={onClose}
      >
        <VscClose size={CONTROL_ICON_SIZE}/>
      </div>

    </StyledWindowHeader>
  );
};

export default WindowHeader;