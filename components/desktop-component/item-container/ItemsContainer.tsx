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
    setDesktopItems(items);
  }, [files]);

  useEffect(() => {
    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('mousedown', unselectAllItems, true);
    return () => desktop?.removeEventListener('mousedown', unselectAllItems, true);
  }, []);

  const moveItem = (itemName: string, top: number, left: number) => {
    const element = desktopItems.find(el => el.name === itemName);
    if (!element) return;

    const { correctedLeft, correctedTop } = correctItemPosition(top, left);
    if (isItemOverlapingOtherItems(itemName, top, left, desktopItems)) 
      return;

    element.top = correctedTop;
    element.left = correctedLeft;

    setDesktopItems(() => [...desktopItems]);
  };

  const selectItem = (id: string, selected: boolean) => {
    const item = desktopItems.find(i => i.name === id);
    if (!item) return;
    
    const hasChanged = item.selected !== selected;
    item.selected = selected;

    if (hasChanged) {
      setDesktopItems(() => [...desktopItems]);
    }
  };

  const unselectAllOtherItems = (id: string) => {
    setDesktopItems(prevItems => {
      prevItems.forEach(i => i.selected = i.id === id);
      return [...prevItems];
    });
  };

  const unselectAllItems = () => {
    setDesktopItems(prevItems => {
      const updatedItems = prevItems.map(item => ({ ...item, selected: false}));
      return [...updatedItems];
    });
  };

  const handleItemDoubleClick = (itemId: string) => {
    console.log('received double click from item');
  };

  const handleSelectionBoxUpdates = (elements: HTMLElement[]) => {
    const selectedItemIds = elements.map(element => element.id);

    setDesktopItems(prevItems => {
      prevItems.forEach(i => i.selected = selectedItemIds.includes(i.id));
      return [...prevItems];
    });
  };

  return (
    <Fragment>
      {desktopItems.map((item, index) =>
        (
          <DesktopItemComponent 
            key={index}
            item={item}
            moveItem={moveItem}
            selectItem={selectItem}
            unselectAllOther={unselectAllOtherItems}
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