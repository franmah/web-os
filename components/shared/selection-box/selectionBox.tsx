import { FC, useEffect, useState } from 'react';
import { SelectionBox } from '../../../types/shared/SelectionBox';
import styles from './selectionBox.module.scss';
import { getBoxNewPosition } from './selection-box.service';

const SELECTION_BOX_OFF: SelectionBox = {
  active: false,
  height: 0,
  left: 0,
  startX: 0,
  startY: 0,
  top: 0,
  width: 0,
  border: '0px solid transparent'
};

const SelectionBoxComponent: FC<{ updateSelection: Function }> = ({ updateSelection }) => {

  const [selectionBox, setSelectionBox] = useState<SelectionBox>(SELECTION_BOX_OFF);

  // Start selection box when dragging start
  useEffect(() => {
    const onMouseDown = (event: any) => {
      const target = event?.originalTarget?.id;
      if (target === 'desktop') { // TODO: need to change it to work with componentts other than Desktop.
         setSelectionBox({
          ...selectionBox,
          active: true,
          left: +event.clientX,
          startX: +event.clientX,
          startY: +event.clientY,
          top: +event.clientY,
          border: '1px solid #0078d7'
        });
      }
    };

    const onMouseUp = () => {
      setSelectionBox(SELECTION_BOX_OFF);
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
    const emitItemsInSelectionBox = () => {
      const { top, left } = selectionBox;
      const bottom = top + selectionBox.height;
      const right = left + selectionBox.width;
      updateSelection(top, bottom, left, right);
    };

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

      emitItemsInSelectionBox();
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
          border: selectionBox.border
        }}
      >
      </div>
  );
};

export default SelectionBoxComponent;