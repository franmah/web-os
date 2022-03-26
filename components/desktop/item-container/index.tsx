import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import DesktopItemComponent from './item';
import { correctItemPosition, isItemOverlapingOtherItems,
  toItemWrappers, placeItemsAtStartPosition, isMouseOverItem } from './desktop-item-container.service';
import styles from './../desktop.module.scss';

// TODO: move to it's own file
export type DesktopItem = {
  left: number,
  iconPath: string,
  name: string,
  top: number
}

type SelectionBox = {
  active: boolean,
  top: number,
  left: number,
  startX: number,
  startY: number
}

const startSelectionBox: SelectionBox = {
  active: false,
  left: 0,
  startX: 0,
  startY: 0,
  top: 0
};

// TODO: should use a canvas?
const DesktopItemContainer: FC<{ files: ExplorerFile[] }> = ({ files }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);
  const [selectionBox, setSelectionBox] = useState<SelectionBox>(startSelectionBox);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(items);
  }, []);

  // For selecting multiple elements by dragging
    // ERROR: NOT GETTING UPDATED SELECTION BOX BECAUSE INDSIDE USE EFFECT()
  useEffect(() => {
    let savedMouseX = 0;
    let savedMouseY = 0;

    const onMouseDown = (event: any) => {
      // TODO: change to check it's over anything other than 'desktop'?
      if (!isMouseOverItem(event.clientX, event.clientY, desktopItems)) {
         setSelectionBox({
          ...selectionBox,
          active: true,
          startX: +event.clientX,
          startY: +event.clientY
        });
      }
    };

    const onMouseUp = () => {
      setSelectionBox({ ...selectionBox, active: false });
    }

    const onMouseMove = (event: any) => {
      if (selectionBox.active) {
        savedMouseX = event.clientX;
        savedMouseY = event.clientY;

        setSelectionBox({ ...selectionBox, startX: savedMouseX, startY: savedMouseY });
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [desktopItems]);

  const moveItem = (itemId: string, top: number, left: number) => {
    const element = desktopItems.find(el => el.name === itemId);
    if (!element) return;

    const { correctedLeft, correctedTop } = correctItemPosition(top, left);
    if (isItemOverlapingOtherItems(itemId, top, left, desktopItems)) return;

    element.top = correctedTop;
    element.left = correctedLeft;

    setDesktopItems(JSON.parse(JSON.stringify(desktopItems)));
  };

  const getSelectionBoxClassName = (): string => {
    return selectionBox.active ? styles.selectionBoxOn : styles.selectionBoxOff;
  };

  return (
    <Fragment>
      { desktopItems.map((el, index) =>
        (
          <DesktopItemComponent key={index} item={el} moveItem={moveItem}/>
        )
      )}

      <div style={{ left: selectionBox.startX, top: selectionBox.startY }}
      className={getSelectionBoxClassName()}></div>
    </Fragment>
  );
};

export default DesktopItemContainer;