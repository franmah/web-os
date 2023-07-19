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
  width: 50px;
  margin: 0px 2px;
  border: 2px solid transparent;

  &:hover {
    background-color: #E3E3E3;
    border: 2px solid #CCCCCC;
    border-radius: 4px;
  }

  .icon {
    margin-top: 2px;
  }

  .open-bar {
    width: ${({ focused }) => focused ? '40%' : '20%'};
    height: 4px;
    border: 1px solid;
    border-color: ${({ focused }) => focused ? '#0064CC' : '#6E6E6E'} ;
    border-radius: 8px;
    background-color: ${({ focused }) => focused ? '#0076D0' : '#858585'};
  }
`;

export const TaskbarApp: FC<{ app: TaskbarAppType }> = ({ app }) => {
  return (
    <StyledTaskbarApp focused={app.focused}>

      <Image className='icon' src={app.iconPath} alt={app.name} width={32} height={32}/>

      { app.open && <div className='open-bar'></div> }

    </StyledTaskbarApp>
  );
};
