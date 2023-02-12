import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import DesktopItemComponent from '../item/DesktopItem';
import { correctItemPosition, isItemOverlapingOtherItems,
  toItemWrappers, placeItemsAtStartPosition, getItemsToSelect } from '../../../services/desktop-item-container.service';
import { DesktopItem } from '../../../types/desktop/DesktopItem';

    // TODO: if one item changes the array of items change. So every item is rendered again
    // use useCallback so that items find out if they've changed or not.

    //  ALSO NEED TO USE A FUNCTION AND USE OLD VALUE IN setDesktopItems
    // Why the re-render:
    // 0. Does the container even need useState for the desktopItems.
    // 1. desktopItems change which re-render DesktopItemContainer which re-render all items.
    // 2. desktopItems update then desktopItems think they've changed.
    // 3. Real issue is eventListener, maybe have one event listener on the desktop container and catch the selected item?
    // 4. remove change on desktopItems in useEffect. The use effect will only trigger once. Then add eventListeners in that useEffect
    // 5. maybe don't use a state for the desktop items. Each item keeps track of their own state/position. Container pass a function
    //    to check that the position is not conflicting with other items. It also saves the position at the same time. 

const DesktopItemContainer: FC<{ files: ExplorerFile[] }> = ({ files }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(items);
  }, [files]);

  useEffect(() => {
    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('click', setUnselectOnMouseDown, true);
    return () => desktop?.removeEventListener('click', setUnselectOnMouseDown, true);
  }, []);

  const setUnselectOnMouseDown = (event: any) => {
    if (unselectAll()) {
      setDesktopItems(() => [...desktopItems]);
    }
  };

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

  /**
   * @returns true if any item was unselected.
   */
  const unselectAll = (): boolean => {
    let itemsChanged = desktopItems.reduce((hasAnyChange, item) => { 
      const hasChanged = item.selected;
      item.selected = false;
      return hasAnyChange || hasChanged;
    }, false);
    
    return itemsChanged;
  };

  const handleItemDoubleClick = (itemId: string) => {
    console.log('received double click from item');
  };

  // Not working: first two items will be unselected on mouseup even when they shouldn't
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

      {/* <SelectionBoxComponent updateSelection={handleBoxUpdates}/> */}
    </Fragment>
  );
};

export default DesktopItemContainer;