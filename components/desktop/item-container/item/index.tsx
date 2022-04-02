import Image from 'next/image';
import { FC, useEffect } from 'react';
import styles from '../../desktop.module.scss';
import { ITEM_HEIGHT, ITEM_WIDTH, MAX_ITEM_HEIGHT } from '../desktop-item-container.service';
import globalStyles from '../../../../styles/global.module.scss';
import { DesktopItem } from '../../../../types/desktop/DesktopItem';

// TODO: move to consts file
const SHORTENED_NAME_LENGTH = 15;

const DesktopItemComponent: FC<{ item: DesktopItem, moveItem: Function, selectItem: Function, unselectAllOther: Function }> =
({ item, moveItem, selectItem, unselectAllOther }) => {

  useEffect(() => {
    if (item.name === 'num #1')
      console.log(`${item.name}: ${item.selected}`);
    
    let distanceMouseToItemTop = 0;
    let distanceMouseToItemLeft = 0;

    const el = document.getElementById(item.name);
    if (!el) return;

    const onDragEnd = (event: any) => {
      const { top, left } =
        getDestopItemNewPositionRelativeToMouse(event, distanceMouseToItemTop, distanceMouseToItemLeft);
      moveItem(item.name, top, left);

      onClick(event);
    };

    const onClick = (event: any) => {
      if (!item.selected)
        selectItem(item.name, true); // TODO: replace by id
    };

    const onClickOut = (event: any) => {
      if (!el.contains(event.target) && item.selected)
        selectItem(item.name, false);
    };

    const onDoubleClick = (event: any) => {
      // Also trigger 'click' event
    };

    const onDragStart = (event: any) => {
      unselectAllOther(item.name);
      distanceMouseToItemTop = event.clientY - item.top;
      distanceMouseToItemLeft = event.clientX - item.left;
    };

    el.addEventListener('dragend', onDragEnd);
    el.addEventListener('click', onClick);
    el.addEventListener('dbClick', onDoubleClick);
    el.addEventListener('dragstart', onDragStart);
    document.addEventListener('click', onClickOut);

    return () => {
      el.removeEventListener('dragend', onDragEnd);
      el.removeEventListener('click', onClick);
      el.removeEventListener('dblclick', onDoubleClick);
      el.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('click', onClickOut);
    };
  }), [item];

  const formatItemName = (name: string): string => {
    if (item.selected || item.name.length <= SHORTENED_NAME_LENGTH)
     return name;

    const shortenedName = name.substring(0, SHORTENED_NAME_LENGTH);
    return shortenedName + '...';
  };

  const getDestopItemNewPositionRelativeToMouse = (event: any,
  mouseToElementTopOffset: number,

    mouseToElementLeftOffset: number) => {
      return {
        left: +event.clientX - mouseToElementLeftOffset,
        top: +event.clientY - mouseToElementTopOffset
      };
    };

    const getClass = () => {
      const selectionClass = item.selected ? styles.dekstopItemSelected : 
        styles.dekstopItemNotSelected;
      return styles.desktopItem + ' ' + globalStyles.unselectableText +
        ' ' + selectionClass;
    };

  return (
    <div
      id={item.name}
      draggable="true"
      className={getClass()}
      style={{
        maxHeight: item.selected ? MAX_ITEM_HEIGHT : ITEM_HEIGHT, 
        left: item.left,
        top: item.top,
        width: ITEM_WIDTH
      }}
    >
      <Image src={item.iconPath} alt={'icon'} width={60} height={60}/>
      { formatItemName(item.name) }
    </div>
  );
};

export default DesktopItemComponent;