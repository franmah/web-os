import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import DesktopItemComponent from '../item/DesktopItem';
import { correctItemPosition, isItemOverlapingOtherItems,
  toItemWrappers, placeItemsAtStartPosition } from '../../../services/desktop-item-container.service';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import SelectionBoxComponent from '../../shared/selection-box/selectionBoxComponent';

const DesktopItemContainer: FC<{ files: ExplorerFile[] }> = ({ files }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(() => items);
  }, [files]);

  useEffect(() => {
    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('mousedown', () => selectItems(), true);
    return () => desktop?.removeEventListener('mousedown', () => selectItems(), true);
  }, []);

  const moveItem = (itemId: string, top: number, left: number) => {
    const element = desktopItems.find(el => el.id === itemId);
    if (!element) return;

    const { correctedLeft, correctedTop } = correctItemPosition(top, left);
    if (isItemOverlapingOtherItems(itemId, top, left, desktopItems)) 
      return;

    element.top = correctedTop;
    element.left = correctedLeft;

    setDesktopItems(() => [...desktopItems]);
  };

  const selectItems = (...ids: string[] ) => {
    setDesktopItems(prevItems => {
      prevItems.forEach(i => i.selected = ids.includes(i.id));
      return [...prevItems];
    });
  };

  const handleItemDoubleClick = (itemId: string) => {
    console.log('received double click from item');
  };

  const handleSelectionBoxUpdates = (elements: HTMLElement[]) => {
    const selectedItemIds = elements.map(element => element.id);
    selectItems(...selectedItemIds);
  };

  return (
    <Fragment>
      {desktopItems.map((item, index) =>
        (
          <DesktopItemComponent 
            key={index}
            item={item}
            moveItem={moveItem}
            selectItem={selectItems}
            handleDoubleClick={handleItemDoubleClick}
          />
        )
      )}

      <SelectionBoxComponent 
        emitSelectedItemsUpdate={handleSelectionBoxUpdates}
        targetElementId='desktop'
      />
    </Fragment>
  );
};

export default DesktopItemContainer;