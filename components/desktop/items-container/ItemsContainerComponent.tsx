import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useContext, useEffect, useState } from 'react';
import DesktopItemComponent from '../item/DesktopItemComponent';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import SelectionBoxComponent from '../../shared/selectionbox/selectionBoxComponent';
import { placeItemsAtStartPosition, toItemWrappers } from '../../../services/desktopItemContainerService';
import { moveItemsOnDesktop } from '../../../services/desktopItemContainerUiHelperService';
import { ProcessContext } from '../../../contexts/processContext';
import { NewFolderCommand } from '../../../System/contextMenuCommands/newFolderCommand';
import { SortByNameCommand, SortCommandContainer } from '../../../System/contextMenuCommands/sortCommand';

const DesktopItemContainerComponent: FC<{ files: ExplorerFile[] }> = ({ files }) => {

  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);
  const processContext = useContext(ProcessContext);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(() => items);
  }, [files]);

  useEffect(() => {
    const desktop = document.getElementById('desktop');
    desktop?.addEventListener('mousedown', onMouseDown);
    desktop?.addEventListener('contextmenu', onContextMenuClick);

    return () => {
      desktop?.removeEventListener('contextmenu', onContextMenuClick);
      desktop?.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  const onContextMenuClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('on context menu click')

    const newFolderCallback = () => {
      console.log('new folder callback called');
      return true;
    }

    processContext.openProcess('contextMenu', {
      top: event.clientY,
      left: event.clientX,
      commands: [
        new NewFolderCommand(newFolderCallback),
        new SortCommandContainer([
          new SortByNameCommand(() => console.log('sorting by name'))
        ])
      ]
    });
  };

  const onMouseDown = () => {
    selectItems();
  };

  const moveItem = (itemId: string, startItemTop: number, startItemLeft: number, newItemTop: number, newItemLeft: number) => {
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