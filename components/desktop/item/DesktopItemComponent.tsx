import Image from 'next/image';
import { FC, useEffect } from 'react';
import styles from './desktop-item.module.scss';
import globalStyles from '../../../styles/global.module.scss';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { ITEM_HEIGHT, ITEM_WIDTH, MAX_ITEM_HEIGHT, SHORTENED_NAME_LENGTH } from '../../../constants/DesktopConsts';

const DesktopItemComponent: FC<{
  item: DesktopItem,
  moveItem: (
    id: string,
    startItemTop: number,
    startItemLeft: number,
    newItemTop: number,
    newItemLeft: number
  ) => void,
  selectItem: (...ids: string[]) => void,
  handleDoubleClick: (id: string) => void,
  handleContextMenuClick: (event: MouseEvent) => void
}> = ({ item, moveItem, selectItem, handleDoubleClick, handleContextMenuClick }) => {

  let distanceMouseToItemTop = 0;
  let distanceMouseToItemLeft = 0;

  const onDoubleClick = (event: any) => {
    handleDoubleClick(item.id);
  };

  const onClick = (event: any) => {
    if (!item.selected) {
      selectItem(item.id);
    }
  };
  
  // TODO: Find a better way to close context menu 
  // see onMouseDown()
  // issue is that without closeProcess, a click on an item won't close the menu because of stopPropagation
  // but without stopPropagation, selecting multiple items and moving will unselect them before they're moved.
  const onMouseDown = (event: any) => {
    event.stopPropagation();
  };

  const onDragEnd = (event: any) => {
    const { top, left } = getDestopItemNewPositionRelativeToMouse(
      event, distanceMouseToItemTop, distanceMouseToItemLeft);
    moveItem(item.id, item.top, item.left, top, left);
  };

  const onDragStart = (event: any) => {
    distanceMouseToItemTop = event.clientY - item.top;
    distanceMouseToItemLeft = event.clientX - item.left;

    if (!item.selected)
      selectItem(item.id);
  };

  const onContextMenuClick = (event: MouseEvent) => {
    event.preventDefault();
    handleContextMenuClick(event);
  };

  useEffect(() => {
    const el = document.getElementById(item.name);
    if (!el) return;

    el.addEventListener('dragend', onDragEnd);
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('click', onClick);
    el.addEventListener('dblclick', onDoubleClick);
    el.addEventListener('dragstart', onDragStart);

    return () => {
      el.removeEventListener('dragend', onDragEnd);
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('click', onClick);
      el.removeEventListener('dblclick', onDoubleClick);
      el.removeEventListener('dragstart', onDragStart);
    };
  }), [];

  const formatItemName = (name: string): string => {
    if (item.selected || item.name.length <= SHORTENED_NAME_LENGTH)
     return name;

    const shortenedName = name.substring(0, SHORTENED_NAME_LENGTH);
    return shortenedName + '...';
  };

  const getDestopItemNewPositionRelativeToMouse = (event: any,
    mouseToElementTopOffset: number, mouseToElementLeftOffset: number) => {

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