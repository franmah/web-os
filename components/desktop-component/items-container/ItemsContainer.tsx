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
    desktop?.addEventListener('click', (event: any) => console.log(`left: ${event.clientX}, top: ${event.clientY}`))
    desktop?.addEventListener('mousedown', onMouseDown);
    return () => desktop?.removeEventListener('mousedown', onMouseDown);
  }, []);

  const onMouseDown = () => {
    selectItems();
  };

  const moveItem = (itemId: string, startItemTop: number, startItemLeft: number, newItemTop: number, newItemLeft: number) => {
    setDesktopItems(prevItems => {
      const element = prevItems.find(el => el.id === itemId);
      if (!element) {
        return prevItems;
      }

      const updatedItems = prevItems.map(item => {
        if (!item.selected) {
          return {...item};
        }
        
        const offsetTop = item.top - startItemTop;
        const offsetLeft = item.left - startItemLeft;

        const { correctedLeft, correctedTop } = correctItemPosition(offsetTop + newItemTop, offsetLeft + newItemLeft);

        if (isItemOverlapingOtherItems(item.id, correctedLeft, correctedTop, prevItems)) {
          return {...item};
        }

        return {
          ...item,
          top: correctedTop,
          left: correctedLeft
        };
      });

      return [...updatedItems];
    });
  };
  
  const selectItems = (...ids: string[] ) => {
    setDesktopItems(prevItems => {
      // prevItems.forEach(i => i.selected = ids.includes(i.id));
      const updated = prevItems.map(i => ({ ...i, selected: ids.includes(i.id)}));
      console.log('selecting items: ' + JSON.stringify(ids))
      return [...updated];
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