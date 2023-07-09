import { ExplorerFile } from '../../../types/system/file/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { DEFAULT_FOLDER_ICON_PATH, getNewItemName, toItemWrappers } from '../../../services/system/desktop/DesktopItemContainerService';
import { getSelectedItemsFromSelectionBoxgWithCtrl, moveItemsOnDesktop, selectItemsWithShiftKey } from '../../../services/system/desktop/DesktopItemContainerUiHelperService';
import { NewFolderCommand } from '../../../System/context-menu-commands/commands/NewFolderCommand';
import { SortCommandContainer } from '../../../System/context-menu-commands/command-containers/SortCommand';
import { NewItemCommandContainer } from '../../../System/context-menu-commands/command-containers/NewItemCommand';
import { SortByNameCommand } from '../../../System/context-menu-commands/commands/SortByNameCommand';
import { isEventOriginatedFromWithinTargetIdSubtree } from '../../../services/EventService';
import { DesktopSortOptions, setItemPositions } from '../../../services/system/desktop/DesktopItemPlacementService';
import { v4 } from 'uuid';
import { ContextMenuCommandList } from '../../../types/system/context-menu/ContextMenu';
import DesktopItemComponent from '../item/DesktopItem';
import SelectionBoxComponent from '../../shared/selection-box/SelectionBox';
import { NewTxtFileCommand } from '../../../System/context-menu-commands/commands/NewTxtFileCommand';
import { defaultProcessByExtension } from '../../../System/process/ProcessDirectoryByExtension';
import { ProcessDirectory } from '../../../System/process/ProcessDirectory';

const DesktopItemContainer: FC<{
  files: ExplorerFile[],
  onDesktopContextMenuClick: (event: MouseEvent, commands: ContextMenuCommandList) => void,
  onItemContextMenuClick: (event: MouseEvent) => void,
  onFileChange: (newItem: DesktopItem) => void,
  onFolderChange: (item: DesktopItem) => void,
  onItemDoubleClick: (item: DesktopItem) => void
}> = ({ files, onDesktopContextMenuClick, onItemContextMenuClick, onFileChange, onFolderChange, onItemDoubleClick }) => {

  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const items = toItemWrappers(files);
    setDesktopItems(() => [...setItemPositions(items, DesktopSortOptions.default)]);
  }, [files]);

  // Any click anywhere in the app should unselect all items
  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (event.ctrlKey) {
        return;
      }

      // If mousedown is on desktop unselect all items.
      if ((event.target as any).id === 'desktop') {
        selectItems();
        return;
      }

      // If mousedown event comes from an item then don't unselect
      const isEventFromAnyItem = desktopItems.some(item =>
        isEventOriginatedFromWithinTargetIdSubtree(event, item.id)
      );

      if (!isEventFromAnyItem) {
        selectItems();
      }
    };

    document.addEventListener('mousedown', onMouseDown, true);
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true);
    };
  }, [desktopItems]);

  useEffect(() => {
    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('contextmenu', onContextMenuClick);
    return () => {
      desktop?.removeEventListener('contextmenu', onContextMenuClick);
    };
  }, []);

  const onContextMenuClick = (event: MouseEvent) => {
    const commands = [
      new NewItemCommandContainer([
        new NewFolderCommand(() => addItem(event.clientY, event.clientX, 'folder')),
        new NewTxtFileCommand(() => addItem(event.clientY, event.clientX, 'Text'))
      ]),
      new SortCommandContainer([
        new SortByNameCommand(() => setDesktopItems(currentItems =>
          [...setItemPositions(currentItems, DesktopSortOptions.name)]))
      ])
    ];

    onDesktopContextMenuClick(event, commands);
  };

  const addItem = (top: number, left: number, type: string) => {
    if (type === 'folder') {
      return addFolder(top, left);
    }

    setDesktopItems(currentItems => {
      const newItemName = getNewItemName(type, currentItems);
      let extension = '';

      if (type === 'Text') {
        extension = 'txt';
      }

      const item: DesktopItem = {
        iconPath: ProcessDirectory[defaultProcessByExtension[extension]]?.iconPath || '',
        id: v4(),
        left,
        name: newItemName + '.' + extension,
        renaming: true,
        selected: false,
        top
      };

      onFileChange(item);
      return [...currentItems, item];
    });
  };

  const addFolder = (top: number, left: number) => {
    setDesktopItems(currentItems => {
      const newItemName = getNewItemName('Folder', currentItems);
      const item: DesktopItem = {
        iconPath: DEFAULT_FOLDER_ICON_PATH,
        id: v4(),
        left,
        name: newItemName,
        renaming: true,
        selected: false,
        top
      };

      onFolderChange(item);
      return [...currentItems, item];
    });

  };

  const onItemRenamed = (itemId: string, itemNewName: string) => {
    setDesktopItems(currentItems => {
      if (!itemNewName || itemNewName.trim() === '') {
        return currentItems;
      }

      const isNameAlreadyUsed = currentItems.find(i => i.name === itemNewName && i.id !== itemId);

      if (!isNameAlreadyUsed) {
        const updatedItems: DesktopItem[] = currentItems.map(i => ({
          ...i,
          name: i.id === itemId ? itemNewName : i.name,
          renaming: false,
          selected: i.id === itemId
        }));

        const newItem = updatedItems.find(i => i.id === itemId) as DesktopItem;

        onFileChange(newItem);

        return [...updatedItems];
      }

      return currentItems;
    });
  };

  const moveItem = (
    itemId: string,
    startItemTop: number,
    startItemLeft: number,
    newItemTop: number,
    newItemLeft: number
  ) => {
    setDesktopItems(currentItems => {
      const updatedItems = moveItemsOnDesktop(currentItems, itemId, startItemTop, startItemLeft, newItemTop, newItemLeft);
      return [...updatedItems];
    });
  };

  const selectItems = (...itemIds: string[] ) => {
    setDesktopItems(currentItems => {
      const updated = currentItems.map(i => ({ ...i, selected: itemIds.includes(i.id)}));
      return [...updated];
    });
  };

  const selectItemsWithCtrl = (...itemIds: string[]) => {
    setDesktopItems(currentItems => {
      const updatedItems = currentItems.map(i => ({
        ...i,
        selected: itemIds.includes(i.id) ? !i.selected : i.selected
      }));
      return [...updatedItems];
    });
  };

  const selectItemWithShift = (itemId: string, ctrlKey: boolean) => {
    setDesktopItems(currentItems => {
      const clickedItem = currentItems.find(item => item.id === itemId);

      if (!clickedItem || clickedItem.selected) {
        return currentItems;
      }

      return [...selectItemsWithShiftKey(itemId, currentItems, ctrlKey)];
    });
  };

  const handleItemDoubleClick = (item: DesktopItem) => {
    onItemDoubleClick(item);
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

  const handleItemRenaming = (itemId: string) => {
    setDesktopItems(currentItems => {
      return currentItems.map(i => ({
        ...i,
        renaming: i.id === itemId
      }));
    });
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
            startRenaming={handleItemRenaming}
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

export default DesktopItemContainer;