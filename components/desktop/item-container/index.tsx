import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import DesktopItemComponent from './item';
import { correctItemPosition, isItemOverlapingOtherItems,
  toItemWrappers, placeItemsAtStartPosition, getItemsToSelect } from './desktop-item-container.service';
import SelectionBoxComponent from './selection-box';
import { DesktopItem } from '../../../types/desktop/DesktopItem';

const DesktopItemContainer: FC<{ files: ExplorerFile[] }> = ({ files }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(items);
  }, [files]);

  useEffect(() => {
    const onmousedown = () => {
      desktopItems.forEach(i => i.selected = false);
      setDesktopItems(JSON.parse(JSON.stringify(desktopItems)))
    }

    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('mousedown', onmousedown);

    return () => desktop?.removeEventListener('mousedown', onmousedown);
  }, [desktopItems])

  const moveItem = (itemId: string, top: number, left: number) => {
    const element = desktopItems.find(el => el.name === itemId);
    if (!element) return;

    const { correctedLeft, correctedTop } = correctItemPosition(top, left);
    if (isItemOverlapingOtherItems(itemId, top, left, desktopItems)) 
      return;

    element.top = correctedTop;
    element.left = correctedLeft;

    setDesktopItems(JSON.parse(JSON.stringify(desktopItems)));
  };

  const selectItem = (id: string, selected: boolean) => {
    const item = desktopItems.find(i => i.name === id);
    if (!item) return;
    
    item.selected = selected;
    setDesktopItems(JSON.parse(JSON.stringify(desktopItems)));
  };

  const unselectAllOtherItems = (id: string) => {
    desktopItems.forEach(item => {
      if (item.name !== id)
        item.selected = false;
    });
    setDesktopItems(JSON.parse(JSON.stringify(desktopItems)));
  }

  // Not working: first two items will be unselected on mouseup even when they shouldn't
  const handleBoxUpdates = (top: number, bottom: number, left: number, right: number) => {
    const items = getItemsToSelect(desktopItems, top, bottom, left, right);

    console.log(`items selected: ${items.map(i => i.name).join(', ')}`);

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
  }

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
          />
        )
      )}

      <SelectionBoxComponent updateSelection={handleBoxUpdates}/>
    </Fragment>
  );
};

export default DesktopItemContainer;