import Image from 'next/image';
import { FC, useEffect } from 'react';
import styles from '../../desktop.module.scss';
import { DesktopItem } from '..';
import { getDestopItemNewPositionRelativeToMouse } from '../desktop-item-container.service';

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

  // TODO: only add ... if longer than SHOR,,,
  const formatItemName = (name: string): string => name.substring(0, SHORTENED_NAME_LENGTH) + '...';

  return (
    <div id={item.name} draggable="true"
      className={styles.desktopItemContainer}
      style={{ left: item.left, top: item.top }}
    >
      <Image src={item.iconPath} alt={'icon'} width={50} height={50}/>
      { formatItemName(item.name) }
    </div>
  );
};

export default DesktopItemComponent;