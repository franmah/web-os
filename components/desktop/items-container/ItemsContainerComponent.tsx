import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { DEFAULT_FOLDER_ICON_PATH, getNewItemName, toItemWrappers } from '../../../services/desktopItemContainerService';
import { getSelectedItemsFromSelectionBoxgWithCtrl, moveItemsOnDesktop, selectItemsWithShiftKey } from '../../../services/desktopItemContainerUiHelperService';
import { NewFolderCommand } from '../../../System/contextMenuCommands/commands/newFolderCommand';
import { SortCommandContainer } from '../../../System/contextMenuCommands/commandContainers/sortCommand';
import { NewItemCommandContainer } from '../../../System/contextMenuCommands/commandContainers/newItemCommand';
import { SortByNameCommand } from '../../../System/contextMenuCommands/commands/sortByNameCommand';
import { isEventOriginatedFromWithinTargetIdSubtree } from '../../../services/EventService';
import { DesktopSortOptions, setItemPositions } from '../../../services/DesktopItemPlacementService';
import DesktopItemComponent from '../item/DesktopItemComponent';
import SelectionBoxComponent from '../../shared/selectionbox/selectionBoxComponent';
import { v4 } from 'uuid';

const DesktopItemContainerComponent: FC<{
  files: ExplorerFile[],
  onDesktopContextMenuClick: Function,
  onItemContextMenuClick: Function
}> = ({ files, onDesktopContextMenuClick, onItemContextMenuClick }) => {

  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const items = toItemWrappers(files);
    setDesktopItems(() => [...setItemPositions(items, DesktopSortOptions.default)]);
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
        new NewFolderCommand(() => addFolder(event.clientY, event.clientX))
      ]),        
      new SortCommandContainer([
        new SortByNameCommand(() => setDesktopItems(currentItems => 
          [...setItemPositions(currentItems, DesktopSortOptions.name)]))
      ])
    ];
      
    onDesktopContextMenuClick(event, commands);
  };

  const addFolder = (top: number, left: number) => {

    setDesktopItems(currentItems => {
      const newItemName = getNewItemName(currentItems);

      const item: DesktopItem = {
        top,
        left,
        name: newItemName,
        iconPath: DEFAULT_FOLDER_ICON_PATH,
        selected: false,
        id: v4(),
        renaming: true
      };

      /*
       - Check that name is valid (no duplicate or weird symbol)
       - let desktop component know about item so that it can add it to the file system:
        calls onDesktopItemFileChanged in desktop component and if its id doesn't show up in the desktop's 
        children then you havee to create a new file in the system.
      */

      return [...currentItems, item];
    });
  };

  const onItemRenamed = (itemId: string, itemNewName: string) => {
    console.log('container: ' + itemNewName)
    setDesktopItems(currentItems => {
      if (!itemNewName || itemNewName === '') {
        return currentItems;
      }

      const isNameAlreadyUsed = currentItems.find(i => i.name === itemNewName && i.id !== itemId);

      if (!isNameAlreadyUsed) {
          const updatedItems = currentItems.map(i => ({
            ...i,
            name: i.id === itemId ? itemNewName : i.name,
            renaming: false,
            selected: i.id === itemId
          }))
          
          return [...updatedItems];
      }

      return currentItems;
    })
  };

  const onMouseDown = (event: MouseEvent) => {
    if (event.ctrlKey) { return; }

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

  const selectItems = (...itemIds: string[] ) => {
    setDesktopItems(currentItems => {
      const updated = currentItems.map(i => ({ ...i, selected: itemIds.includes(i.id)}));
      return [...updated];
    });
  };
  
  const selectItemsWithCtrl = (...itemIds: string[])=> {
    setDesktopItems(currentItems => {
      const updatedItems = currentItems.map(i => ({
        ...i,
        selected: itemIds.includes(i.id) ? !i.selected : i.selected
      }));
      return [...updatedItems];
    });
  }

  const selectItemWithShift = (itemId: string, ctrlKey: boolean) => {
    setDesktopItems(currentItems => {
      const clickedItem = currentItems.find(item => item.id === itemId);

      if (!clickedItem || clickedItem.selected) {
        return currentItems;
      }

      return [...selectItemsWithShiftKey(itemId, currentItems, ctrlKey)];
    });
  }

  const handleItemDoubleClick = (itemId: string) => {
    console.log('received double click from item');
  };
  
  const handleSelectionBoxUpdates = (elements: HTMLElement[], previousElementInBox: HTMLElement[], ctrlKey: boolean) => {
    const selectedItemIds = elements.map(element => element.id);

    if (!ctrlKey) {
      selectItems(...selectedItemIds);
    } else {
      setDesktopItems(currentDesktopItems => {
        return [...getSelectedItemsFromSelectionBoxgWithCtrl(currentDesktopItems, selectedItemIds, previousElementInBox)];
      });
    }
  };

  return (
    <Fragment>
      {
        desktopItems.map((item, index) =>
          <DesktopItemComponent
            key={index}
            item={item}
            moveItem={moveItem}
            selectItems={selectItems}
            selectItemsWithCtrl={selectItemsWithCtrl}
            selectItemsWithShift={selectItemWithShift}
            handleDoubleClick={handleItemDoubleClick}
            handleContextMenuClick={event => onItemContextMenuClick(event)}
            handleItemRenamed={onItemRenamed}
          />
        )
      }

      <SelectionBoxComponent 
        emitSelectedItemsUpdate={handleSelectionBoxUpdates}
        targetElementId='desktop'
      />
    </Fragment>
  );
};

export default DesktopItemContainerComponent;