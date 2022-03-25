import { ExplorerFile } from '../../../types/ExplorerElement';
import { FC, Fragment, useEffect, useState } from 'react';
import DesktopItemComponent from './element';
import { correctItemPosition, isItemOverlapingOtherItems, ITEM_HEIGHT } from './desktop-item-container.service';

export type DesktopItem = {
  left: number,
  iconPath: string,
  name: string,
  top: number
}

const DesktopItemContainer: FC<{ files: ExplorerFile[] }> = ({ files }) => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  useEffect(() => {
    setDesktopItems(toItemWrappers(files));
  }, []); // TODO: update

  const moveItem= (itemId: string, top: number, left: number) => {
    const element = desktopItems.find(el => el.name === itemId);
    if (!element) return;

    const { correctedLeft, correctedTop } = correctItemPosition(top, left);
    if (isItemOverlapingOtherItems(itemId, top, left, desktopItems)) return;

    element.top = correctedTop;
    element.left = correctedLeft;

    setDesktopItems(JSON.parse(JSON.stringify(desktopItems)));
  };

  const toItemWrappers = (files: ExplorerFile[]): DesktopItem[] => {
    return files.map((file, index) => {
      return {
        iconPath: file.iconPath,
        left: 1,
        name: file.name,
        top: 20 + (index * ITEM_HEIGHT + index * 20)
      };
    });
  };

  return (
    <Fragment>
      { desktopItems.map((el, index) =>
        (
          <DesktopItemComponent key={index} item={el} moveItem={moveItem}/>
        )
      )}
    </Fragment>
  );
};

export default DesktopItemContainer;