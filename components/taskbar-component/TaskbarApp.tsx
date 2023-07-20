import { FC, useState } from 'react';
import { TaskbarAppType } from './TaskbarApps';
import styled from 'styled-components';
import Image from 'next/image';

export const StyledTaskbarApp = styled.div<{ focused: boolean, multipleOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  height: 100%;
  width: 40px;
  margin: 0px 2px;
  padding: 2px 4px;

  background-color: ${({ focused }) => focused ? '#FAFAFA' : 'inherit'};
  border: ${({ focused }) => focused ? '1px solid #E9E9E9' : '1px solid transparent'};
  border-radius: 4px;

  box-shadow: ${({ multipleOpen }) => multipleOpen ? '1px 0px #e1e1e1' : ''};
  
  &:hover {
    background-color: #FAFAFA;
    border: 1px solid #E9E9E9;
  }

  .icon {
    margin-top: 2px;
  }

  .open-bar {
    width: ${({ focused }) => focused ? '60%' : '20%'};
    height: 2px;
    border: 1px solid;
    border-color: ${({ focused }) => focused ? '#0064CC' : '#6E6E6E'} ;
    border-radius: 8px;
    background-color: ${({ focused }) => focused ? '#0078D4' : '#858585'};
  }
`;

export const StyledExtrabackWindow = styled.div`
  position: absolute;
  z-index: -1;
  bottom: 2px;
  top: 2px;

  margin-left: 20px;
  width: 30px;
  background-color: #FAFAFA;
  border: 1px solid #E9E9E9;
  border-radius: 4px;
`;

export const TaskbarApp: FC<{
  app: TaskbarAppType;
  onOpenApp: (appName: string) => void;
  onContextMenu: (event: MouseEvent, appName: string) => void;
  id: string;
}> = ({ app, onOpenApp, onContextMenu, id }) => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <StyledTaskbarApp
      id={id}
      focused={app.focused}
      multipleOpen={app.multipleOpen}
      onClick={() => onOpenApp(app.name)}
      onMouseDown={e => e.stopPropagation()} // Avoids unfocusing window due to click
      onContextMenu={e => onContextMenu(e as any, app.name)}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
    >
      {
        app.multipleOpen && (app.focused || hovering ) &&
          <StyledExtrabackWindow>
          </StyledExtrabackWindow>
      }

      <Image className='icon' src={app.iconPath} alt={app.name} width={24} height={24}/>

      { app.open && <div className='open-bar'></div> }

    </StyledTaskbarApp>
  );
};
