import { FC } from 'react';
import { TaskbarAppType } from './TaskbarApps';
import styled from 'styled-components';
import Image from 'next/image';

export const StyledTaskbarApp = styled.div<{ focused: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  height: 100%;
  margin: 0px 2px;
  padding: 2px 4px;
  border: 2px solid transparent;

  &:hover {
    background-color: #FAFAFA;
    border: 2px solid #E9E9E9;
    border-radius: 4px;
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

export const TaskbarApp: FC<{ app: TaskbarAppType }> = ({ app }) => {
  return (
    <StyledTaskbarApp focused={app.focused}>

      <Image className='icon' src={app.iconPath} alt={app.name} width={20} height={20}/>

      { app.open && <div className='open-bar'></div> }

    </StyledTaskbarApp>
  );
};
