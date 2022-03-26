import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import DesktopItemComponent from './item';
import { correctItemPosition, isItemOverlapingOtherItems,
  toItemWrappers, placeItemsAtStartPosition, isMouseOverItem } from './desktop-item-container.service';
import styles from './../desktop.module.scss';
import { clamp } from '../../../shared/services/mathHelper';

// TODO: move types to their own file
export type DesktopItem = {
  left: number,
  iconPath: string,
  name: string,
  top: number
}

type SelectionBox = {
  active: boolean,
  startX: number,
  startY: number,
  width: number,
  height: number,
  top: number,
  left: number,
  zindex: number
}

const startSelectionBox: SelectionBox = {
  active: false,
  height: 0,
  left: 0,
  startX: 0,
  startY: 0,
  top: 0,
  width: 0,
  zindex: -1
};

const DesktopItemContainer: FC<{ files: ExplorerFile[] }> = ({ files }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);
  const [selectionBox, setSelectionBox] = useState<SelectionBox>(startSelectionBox);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(items);
  }, []);

  // Start selection box when dragging start
  useEffect(() => {
    const onMouseDown = (event: any) => {
      if (!isMouseOverItem(event.clientX, event.clientY, desktopItems)) {
         setSelectionBox({
          ...selectionBox,
          active: true,
          left: +event.clientX,
          startX: +event.clientX,
          startY: +event.clientY,
          top: +event.clientY,
          zindex: 1
        });
      }
    };

    const onMouseUp = () => {
      setSelectionBox({ ...selectionBox, active: false, zindex: -1 });
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
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

      setSelectionBox({
        ...selectionBox,
        height,
        left,
        top,
        width
      });
    };

    if (selectionBox.active) {
      document.addEventListener('mousemove', mousemove);

      return () => document.removeEventListener('mousemove', mousemove);
    }
  }, [selectionBox]);

  const moveItem = (itemId: string, top: number, left: number) => {
    const element = desktopItems.find(el => el.name === itemId);
    if (!element) return;

    const { correctedLeft, correctedTop } = correctItemPosition(top, left);
    if (isItemOverlapingOtherItems(itemId, top, left, desktopItems)) return;

    element.top = correctedTop;
    element.left = correctedLeft;

    setDesktopItems(JSON.parse(JSON.stringify(desktopItems)));
  };

  return (
    <Fragment>
      { desktopItems.map((item, index) =>
        (
          <DesktopItemComponent key={index} item={item} moveItem={moveItem}/>
        )
      )}

      <div style={{
          height: selectionBox.height,
          left: selectionBox.left,
          top: selectionBox.top,
          width: selectionBox.width,
          zIndex: selectionBox.zindex
        }}
      className={styles.selectionBoxOn}></div>
    </Fragment>
  );
};

export default DesktopItemContainer;