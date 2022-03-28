import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import DesktopItemComponent from './item';
import { correctItemPosition, isItemOverlapingOtherItems,
  toItemWrappers, placeItemsAtStartPosition } from './desktop-item-container.service';
import SelectionBoxComponent from './selection-box';

// TODO: move types to their own file
export type DesktopItem = {
  left: number,
  iconPath: string,
  name: string,
  top: number,
  selected: boolean
}

const DesktopItemContainer: FC<{ files: ExplorerFile[] }> = ({ files }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    const items = toItemWrappers(files);
    placeItemsAtStartPosition(items);
    setDesktopItems(items);
  }, []);

  const moveItem = (itemId: string, top: number, left: number) => {
    const element = desktopItems.find(el => el.name === itemId);
    if (!element) return;

    const { correctedLeft, correctedTop } = correctItemPosition(top, left);
    if (isItemOverlapingOtherItems(itemId, top, left, desktopItems)) return;

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

  const handleBoxUpdates = () => {
  }

  return (
    <Fragment>
      { desktopItems.map((item, index) =>
        (
          <DesktopItemComponent key={index} item={item} moveItem={moveItem} 
            selectItem={selectItem} unselectAllOther={unselectAllOtherItems}
          />
        )
      )}

      <SelectionBoxComponent desktopItems={desktopItems} updateSelection={handleBoxUpdates}/>
    </Fragment>
  );
};

export default DesktopItemContainer;