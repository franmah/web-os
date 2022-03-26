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
  startX: number,
  startY: number,
  width: number,
  height: number
}

const startSelectionBox: SelectionBox = {
  active: false,
  startX: 0,
  startY: 0,
  height: 0,
  width: 0
};

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
    const onMouseDown = (event: any) => {
      // TODO: change to check it's over anything other than 'desktop'?
      console.log(`${event.clientY}, ${document.body.clientWidth}`)
      if (!isMouseOverItem(event.clientX, event.clientY, desktopItems)) {
         setSelectionBox({
          ...selectionBox,
          active: true,
          startX: window.innerWidth - +event.clientX,
          startY: +event.clientY
        });
      }
    };

    const onMouseUp = () => {
      setSelectionBox({ ...selectionBox, active: false });
    }

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [desktopItems]);

  useEffect(() => {
    console.log(selectionBox)
    const mousemove = (event: any) => {
      const width = Math.abs(selectionBox.startX - +event.clientX);
      const height = Math.abs(selectionBox.startY - +event.clientY);

      //console.log(width + ' ' + height)
      setSelectionBox({
        ...selectionBox,
        width, height
      });

      console.log(selectionBox);
    }

    if (selectionBox.active) {
      document.addEventListener('mousemove', mousemove);

      return () => {
        document.removeEventListener('mousemove', mousemove);
      };
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

  const getSelectionBoxClassName = (): string => {
    console.log('redrawing')
    return selectionBox.active ? styles.selectionBoxOn : styles.selectionBoxOff;
  };

  return (
    <Fragment>
      { desktopItems.map((item, index) =>
        (
          <DesktopItemComponent key={index} item={item} moveItem={moveItem}/>
        )
      )}

      <div style={{ top: selectionBox.startY, right: selectionBox.startX,
        width: selectionBox.width, height: selectionBox.height}}
      className={styles.selectionBoxOn}></div>
    </Fragment>
  );
};

export default DesktopItemContainer;