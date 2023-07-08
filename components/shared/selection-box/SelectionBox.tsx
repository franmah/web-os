import { FC, useEffect, useState } from 'react';
import { SelectionBox, SelectionBoxSize } from '../../../types/shared/SelectionBox';
import styles from './selection-box.module.scss';
import { getBoxNewPosition, getElementsInBox, SELECTION_BOX_OFF } from '../../../services/selectionBoxService';

/**
 * @emitSelectedItemsUpdate sends update of elements within selection as its dragged.
 *  Only go through elements that are directly children of target element.
 */
const SelectionBoxComponent: FC<{
  targetElementId: string,
  emitSelectedItemsUpdate: (elementsInBox: HTMLElement[], previousElementsInBox: HTMLElement[], ctrlKey: boolean) => void
}> = ({ targetElementId, emitSelectedItemsUpdate }) => {

  const [selectionBox, setSelectionBox] = useState<SelectionBox>(SELECTION_BOX_OFF);
  const [previouslySelected, setPreviouslySelectedElements] = useState<HTMLElement[]>([]);

  // Start selection box when dragging start
  useEffect(() => {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;
    
    targetElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      targetElement.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Updates selection box div
  useEffect(() => {
    if (selectionBox.active) {
      document.addEventListener('mousemove', onMouseMove);

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [selectionBox]);
  
  const onMouseDown = (event: any) => {
    try {
      if (event.which === 2 || event.which === 3) {
        return; // Only trigger on left click.
      }
  
      const target = event?.target?.id;
      if (target === targetElementId) {
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
    } catch (error) {
      console.warn(`Error in selection box component mouse down:\n${error}`);
    }   
  };

  const onMouseUp = () => {
    setSelectionBox(SELECTION_BOX_OFF);
    setPreviouslySelectedElements([]);
  };

  const onMouseMove = (event: MouseEvent) => {
    const { clientY, clientX } = event;
    const { clientHeight, clientWidth } = document.getElementById(targetElementId) as HTMLElement;
    const { top, left, width, height } = getBoxNewPosition(selectionBox, clientX, clientY, clientHeight, clientWidth);

    const updatedSelectionBox: SelectionBox = {
      ...selectionBox,
      height,
      left,
      top,
      width
    };

    emitUpdateElementsInSelectionBox(event?.ctrlKey);
    setSelectionBox(updatedSelectionBox);
  };

  const emitUpdateElementsInSelectionBox = (ctrlKey: boolean) => {
    const elementsInBox = getItemsInBox();
    setPreviouslySelectedElements(currentPreviouslySelected => {
      emitSelectedItemsUpdate(elementsInBox, currentPreviouslySelected, ctrlKey);
      return [...elementsInBox];
    });
  };

  const getItemsInBox = (): HTMLElement[] => {
    const element = document.getElementById(targetElementId);

    if (!element) { return []; }

    const boxSize: SelectionBoxSize = {
       top: selectionBox.top,
       left: selectionBox.left,
       bottom: selectionBox.top + selectionBox.height,
       right: selectionBox.left + selectionBox.width
    };

    const children = Array.from(element.children) as HTMLElement[];
    return getElementsInBox(children, boxSize);
  };

  return (
      <div
        id='selectionBoxRoot'
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