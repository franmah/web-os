import { FC, useState } from 'react';
import { TaskbarAppType } from './TaskbarApps';
import styled from 'styled-components';
import Image from 'next/image';
import { Draggable } from 'react-beautiful-dnd';

export const StyledTaskbarApp = styled.button<{ focused: boolean, multipleOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

	cursor: default !important; // Overrides beautiful-dnd
  height: 100%;
  width: 40px;
  margin: 0px 2px;
  padding: 2px 4px;

  background-color: ${({ focused }) => focused ? '#FAFAFA' : 'inherit'};
  border: ${({ focused }) => focused ? '1px solid #E9E9E9' : '1px solid transparent'};
  border-radius: 4px;

  box-shadow: ${({ focused, multipleOpen }) => focused && multipleOpen ? '1px 0px #e1e1e1' : ''};
  
  &:hover {
    background-color: #FAFAFA;
    border: 1px solid #E9E9E9;
    box-shadow: ${({ multipleOpen }) => multipleOpen ? '1px 0px #e1e1e1' : ''};
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
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

  &:focus {
    .icon {
      animation-name: click-animation;
      animation-duration: .4s;
    }
  }

  @keyframes click-animation {
    0% { transform: scale(1) }
    50% { transform: scale(.75); }
    100% { transform: scale(1); }
  }
`;

export const StyledExtraBackWindow = styled.div`
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
  index: number;
}> = ({ app, onOpenApp, onContextMenu, id, index }) => {
  const [hovering, setHovering] = useState<boolean>(false);

  /**
   * Keep app icons locked to the x-axis.
   */
	const dragXAxisLockStyle = (style: React.CSSProperties | undefined) => {
    if (style?.transform) {
      const axisLockX = `${style.transform.split(',').shift()}, 0px)`;
      return {
        ...style,
        transform: axisLockX
      };
    }
    return style;
  };

  return (
    <Draggable draggableId={'draggable-' + id} index={index}>
      {provided => (
        <StyledTaskbarApp
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={dragXAxisLockStyle(provided.draggableProps.style)}
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
              <StyledExtraBackWindow>
              </StyledExtraBackWindow>
          }

          <Image className='icon' src={app.iconPath} alt={app.name} width={24} height={24}/>

          { app.open && <div className='open-bar'></div> }
        </StyledTaskbarApp>
      )}

    </Draggable>

  );
};
