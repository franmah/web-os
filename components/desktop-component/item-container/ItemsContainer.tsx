import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import DesktopItemComponent from '../item/DesktopItem';
import { correctItemPosition, isItemOverlapingOtherItems,
  toItemWrappers, placeItemsAtStartPosition, getItemsToSelect } from '../../../services/desktop-item-container.service';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import SelectionBoxComponent from '../../shared/selection-box/selectionBox';

const DesktopItemContainer: FC<{ files: ExplorerFile[] }> = ({ files }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(items);
  }, [files]);

  useEffect(() => {
    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('click', unselectAllItems, true);
    return () => desktop?.removeEventListener('click', unselectAllItems, true);
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
    desktopItems.forEach(item => {
      if (item.name !== id)
        item.selected = false;
    });

    setDesktopItems(() => [...desktopItems]);
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

  const handleBoxUpdates = (top: number, bottom: number, left: number, right: number) => {
    const items = getItemsToSelect(desktopItems, top, bottom, left, right);

    let updated = false;
    desktopItems.forEach(i => {
      if (i.selected) {
        i.selected = false;
        updated = true;
      }
    });

    items.forEach(i => i.selected = true);

    if (updated || items.length > 0)
      setDesktopItems(JSON.parse(JSON.stringify(desktopItems)));
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

      <SelectionBoxComponent updateSelection={handleBoxUpdates}/>
    </Fragment>
  );
};

export default DesktopItemContainer;