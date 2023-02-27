import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import DesktopItemComponent from '../item/DesktopItemComponent';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import SelectionBoxComponent from '../../shared/selectionbox/selectionBoxComponent';
import { placeItemsAtStartPosition, toItemWrappers } from '../../../services/desktopItemContainerService';
import { moveItemsOnDesktop } from '../../../services/desktopItemContainerUiHelperService';
import { NewFolderCommand } from '../../../System/contextMenuCommands/commands/newFolderCommand';
import { SortCommandContainer } from '../../../System/contextMenuCommands/commandContainers/sortCommand';
import { NewItemCommandContainer } from '../../../System/contextMenuCommands/commandContainers/newItemCommand';
import { SortByNameCommand } from '../../../System/contextMenuCommands/commands/sortByNameCommand';
import { isEventOriginatedFromWithinTargetIdSubtree } from '../../../services/EventService';

const DesktopItemContainerComponent: FC<{
  files: ExplorerFile[],
  onDesktopContextMenuClick: Function,
  onItemContextMenuClick: Function
}> = ({ files, onDesktopContextMenuClick, onItemContextMenuClick }) => {

  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(() => items);
  }, [files]);

  // Any click anywhere in the app should unselect all items
  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown, true);
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true);
    }
  }, [desktopItems]);

  useEffect(() => {
    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('contextmenu', onContextMenuClick);
    return () => {
      desktop?.removeEventListener('contextmenu', onContextMenuClick);
    };
  }, []);

  const onContextMenuClick = (event: MouseEvent) => {
    const commands =  [
      new NewItemCommandContainer([
        new NewFolderCommand(() => console.log('new folder callback'))
      ]),        
      new SortCommandContainer([
        new SortByNameCommand(() => console.log('sorting by name'))
      ])
    ];
      
    onDesktopContextMenuClick(event, commands);
  };

  const onMouseDown = (event: MouseEvent) => {

    // If mousedown is on desktop unselect all items.
    if ((event.target as any).id === 'desktop') {
      selectItems();
      return;
    } 

    // If mousedown is from an item then don't unselect
    const isEventFromAnyItem = desktopItems.some(item => 
      isEventOriginatedFromWithinTargetIdSubtree(event, item.id)
    );

    if (!isEventFromAnyItem) {
      selectItems();
    }
  };

  const moveItem = (
    itemId: string,
    startItemTop: number,
    startItemLeft: number,
    newItemTop: number,
    newItemLeft: number
  ) => {
    setDesktopItems(prevItems => {
      const updatedItems = moveItemsOnDesktop(prevItems, itemId, startItemTop, startItemLeft, newItemTop, newItemLeft);
      return [...updatedItems];
    });
  };

  const selectItems = (...ids: string[] ) => {
    setDesktopItems(prevItems => {
      const updated = prevItems.map(i => ({ ...i, selected: ids.includes(i.id)}));
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
              handleContextMenuClick={event => onItemContextMenuClick(event)}
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

export default DesktopItemContainerComponent;