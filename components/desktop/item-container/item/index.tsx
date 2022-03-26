import Image from 'next/image';
import { FC, useEffect } from 'react';
import styles from '../../desktop.module.scss';
import { DesktopItem } from '..';
import { ITEM_HEIGHT, ITEM_WIDTH } from '../desktop-item-container.service';
import globalStyles from '../../../../styles/global.module.scss';

const SHORTENED_NAME_LENGTH = 15;

const DesktopItemComponent: FC<{ item: DesktopItem, moveItem: Function }> = ({ item, moveItem }) => {

  useEffect(() => {
    let distanceMouseToItemTop = 0;
    let distanceMouseToItemLeft = 0;

    const el = document.getElementById(item.name);
    if (!el) return;

    const onDragEnd = (event: any) => {
      const { top, left } =
        getDestopItemNewPositionRelativeToMouse(event, distanceMouseToItemTop, distanceMouseToItemLeft);
      moveItem(item.name, top, left);

      // Will that work?
      onClick(event);
    };

    const onClick = (event: any) => {
      // console.log('click');
    };

    const onDoubleClick = (event: any) => {
      // Also trigger 'click' event
    };

    const onDragStart = (event: any) => {
      distanceMouseToItemTop = event.clientY - item.top;
      distanceMouseToItemLeft = event.clientX - item.left;
    };

    el.addEventListener('dragend', onDragEnd);
    el.addEventListener('click', onClick);
    el.addEventListener('dbClick', onDoubleClick);
    el.addEventListener('dragstart', onDragStart);

    return () => {
      el.removeEventListener('dragend', onDragEnd), false;
      el.removeEventListener('click', onClick), false;
      el.removeEventListener('dblclick', onDoubleClick), false;
      el.removeEventListener('dragstart', onDragStart);
    };
  }), [item];

  const formatItemName = (name: string): string => {
    const shortenedName = name.substring(0, SHORTENED_NAME_LENGTH);
    return shortenedName.length > SHORTENED_NAME_LENGTH ?
      shortenedName + '...' :
      shortenedName;
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
    return styles.desktopItem + ' ' + globalStyles.unselectableText;
  };

  return (
    <div id={item.name} draggable="true"
      className={getClass()}
      style={{ height: ITEM_HEIGHT, left: item.left, top: item.top, width: ITEM_WIDTH }}
    >
      <Image src={item.iconPath} alt={'icon'} width={60} height={60}/>
      { formatItemName(item.name) }
    </div>
  );
};

export default DesktopItemComponent;