import { FC, useEffect, useState } from 'react';
import { isMouseOverItem } from './../desktop-item-container.service';
import { clamp } from '../../../../shared/services/mathHelper';
import { DesktopItem } from '..';
import { SelectionBox } from '../../../../types/shared/SelectionBox';
import styles from './../../desktop.module.scss';


const startSelectionBox: SelectionBox = {
  active: false,
  height: 0,
  left: 0,
  startX: 0,
  startY: 0,
  top: 0,
  width: 0,
};

//
// TODO: should be more generic: 
// make only a single selection box. 
// box component should be in app.
// use state management (behaviorsubject, context...)
// set state with target elementes
const SelectionBoxComponent: FC<{ desktopItems: DesktopItem[], updateSelection: Function }> = ({ desktopItems, updateSelection }) => {
  const [selectionBox, setSelectionBox] = useState<SelectionBox>(startSelectionBox);

  // Start selection box when dragging start
  useEffect(() => {
    const onMouseDown = (event: any) => {
      // TODO: should check that mouse is over #desktop and nothing else
      if (!isMouseOverItem(event.clientX, event.clientY, desktopItems)) {
         setSelectionBox({
          ...selectionBox,
          active: true,
          left: +event.clientX,
          startX: +event.clientX,
          startY: +event.clientY,
          top: +event.clientY,
        });
      }
    };

    const onMouseUp = () => {
      setSelectionBox({ ...selectionBox, active: false });
    };

    const desktopElement = document.getElementById('desktop');
    if (!desktopElement) return;
    
    desktopElement.addEventListener('mousedown', onMouseDown);
    desktopElement.addEventListener('mouseup', onMouseUp);

    return () => {
      desktopElement.removeEventListener('mousedown', onMouseDown);
      desktopElement.removeEventListener('mouseup', onMouseUp);
    };
  }, [desktopItems]);

  // Updates selection box div
  useEffect(() => {

    const mousemove = (event: any) => {
      const { clientY, clientX } = event;

      const width = Math.abs(selectionBox.startX - +clientX);
      const height = Math.abs(selectionBox.startY - +clientY);

      // Mouse relative to start position
      const bottomRight = clientX >= selectionBox.startX && clientY >= selectionBox.startY;
      const bottomLeft = clientX < selectionBox.startX && clientY > selectionBox.startY;
      const topLeft = clientX <= selectionBox.startX && clientY <= selectionBox.startY;
      const topRight = clientX > selectionBox.startX && clientY < selectionBox.startY;

      let top = 0, left = 0;

      // TODO: prevent from going out of window
      if (bottomRight) {
        top = selectionBox.startY;
        left = selectionBox.startX;
      } else if (bottomLeft) {
        top = selectionBox.startY;
        left = clientX;
      } else if (topLeft) {
        top = clientY;
        left = clientX;
      } else if (topRight) {
        top = clientY;
        left = selectionBox.startX;
      }

      // TODO: create const file with taskbar size
      top = clamp(0, top, window.innerHeight - 75);
      left = clamp(0, left, document.body.clientWidth);

      const updatedSelectionBox: SelectionBox = {
        ...selectionBox,
        height,
        left,
        top,
        width
      };

      updateSelection(top);
      setSelectionBox(updatedSelectionBox);
    };

    if (selectionBox.active) {
      document.addEventListener('mousemove', mousemove);

      return () => {
        document.removeEventListener('mousemove', mousemove);
      };
    }
  }, [selectionBox]);

  return (
      <div style={{
          height: selectionBox.height,
          left: selectionBox.left,
          top: selectionBox.top,
          width: selectionBox.width,
        }}
        className={styles.selectionBox}
      >
      </div>
  );
};

export default SelectionBoxComponent;