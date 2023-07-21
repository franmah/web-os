import { FC, useState } from 'react';
import Image from 'next/image';
import { Draggable } from 'react-beautiful-dnd';
import { TaskbarAppType } from '../../types/taskbar/TaskbarAppType';
import { StyledExtraBackWindow, StyledTaskbarApp } from '../../styled-components/system/taskbar/StyledTaskbarApp';

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
