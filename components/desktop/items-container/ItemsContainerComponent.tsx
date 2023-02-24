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

  useEffect(() => {
    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('mousedown', onMouseDown);
    desktop?.addEventListener('click', () => console.log('click desktop'));
    desktop?.addEventListener('contextmenu', onContextMenuClick);

    return () => {
      desktop?.removeEventListener('contextmenu', onContextMenuClick);
      desktop?.removeEventListener('mousedown', onMouseDown);
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

  const onMouseDown = () => {
    selectItems();
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