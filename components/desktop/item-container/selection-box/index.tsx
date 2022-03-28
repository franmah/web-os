import { FC, useEffect, useState } from 'react';
import { DesktopItem } from '..';
import { SelectionBox } from '../../../../types/shared/SelectionBox';
import styles from './../../desktop.module.scss';
import { getBoxNewPosition } from './selection-box.service';


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
const SelectionBoxComponent: FC<{ updateSelection: Function }> = ({ updateSelection }) => {

  const [selectionBox, setSelectionBox] = useState<SelectionBox>(startSelectionBox);

  // Start selection box when dragging start
  useEffect(() => {
    const onMouseDown = (event: any) => {
      const target = event.path?.[0];
      if (target.id === 'desktop') {
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
      // TODO: hide it better
      setSelectionBox({ ...selectionBox, active: false, width: 0, height: 0 });
    };

    const desktopElement = document.getElementById('desktop');
    if (!desktopElement) return;
    
    desktopElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      desktopElement.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Updates selection box div
  useEffect(() => {
    const updateParent = () => {
      const { top, left } = selectionBox;
      const bottom = top + selectionBox.height;
      const right = left + selectionBox.width;
      updateSelection(top, bottom, left, right);
    }

    const mousemove = (event: any) => {
      const { clientY, clientX } = event;
      const { top, left, width, height } = getBoxNewPosition(selectionBox, clientX, clientY);

      const updatedSelectionBox: SelectionBox = {
        ...selectionBox,
        height,
        left,
        top,
        width
      };

      updateParent();
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
      <div 
        className={styles.selectionBox}
        style={{
          height: selectionBox.height,
          left: selectionBox.left,
          top: selectionBox.top,
          width: selectionBox.width,
        }}
      >
      </div>
  );
};

export default SelectionBoxComponent;