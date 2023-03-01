import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
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
  selectItems: (...ids: string[]) => void,
  selectItemsWithCtrl: (...ids: string[]) => void,
  selectItemsWithShift: (id: string, ctrlKey: boolean) => void,
  handleDoubleClick: (id: string) => void,
  handleContextMenuClick: (event: MouseEvent) => void,
  handleItemRenamed: (itemId: string, itemNewName: string) => void
}> = ({
  item,
  moveItem,
  selectItems,
  selectItemsWithCtrl,
  selectItemsWithShift,
  handleDoubleClick,
  handleContextMenuClick,
  handleItemRenamed
}) => {

  const [inputNameValue, setInputNameValue] = useState<string>(item.name);
  
  const INPUT_ID = item.id + '_input';

  let distanceMouseToItemTop = 0;
  let distanceMouseToItemLeft = 0;
  let textareaElement: HTMLElement | null;

  const onDoubleClick = (event: any) => {
    handleDoubleClick(item.id);
  };

  const onClick = (event: MouseEvent) => {
    if (event.shiftKey) {
      selectItemsWithShift(item.id, event.ctrlKey);
    } else if (event.ctrlKey) {
      selectItemsWithCtrl(item.id);
    } else if (!item.selected) {
      selectItems(item.id);
    }
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
      selectItems(item.id);
  };

  const onContextMenuClick = (event: MouseEvent) => {
    event.preventDefault();
    handleContextMenuClick(event);
  };

  const onMouseDown = (event: any) => {
    console.log('mouse down')
    if (event?.target?.id !== INPUT_ID) {
      onItemDoneRenaming();
    }
  }

  const onItemDoneRenaming = () => {
    if (inputNameValue && inputNameValue !== '') {
      console.log('item: ' + inputNameValue)
      handleItemRenamed(item.id, inputNameValue);
    }
  }

  useEffect(() => {
    const el = document.getElementById(item.id);
    if (!el) return;

    el.addEventListener('dragend', onDragEnd);
    el.addEventListener('click', onClick);
    el.addEventListener('dblclick', onDoubleClick);
    el.addEventListener('dragstart', onDragStart);

    if (item.renaming) {
      textareaElement = document.getElementById(INPUT_ID);
      document.addEventListener('mousedown', onMouseDown);
    }

    return () => {
      el.removeEventListener('dragend', onDragEnd);
      el.removeEventListener('click', onClick);
      el.removeEventListener('dblclick', onDoubleClick);
      el.removeEventListener('dragstart', onDragStart);

      
      if (item.renaming) {
        document.removeEventListener('mousedown', onMouseDown);
      }
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

  const handleInputName = (event: any) => {
    setInputNameValue(() => event?.target?.value);

    // Resize textarea height
    if (textareaElement) {
      textareaElement.style.height = textareaElement.scrollHeight + 'px';
    }
  }

  return (
    <div
      id={item.id}
      draggable={!item.renaming}
      className={getClass()}
      style={{
        maxHeight: item.selected ? MAX_ITEM_HEIGHT : ITEM_HEIGHT, 
        left: item.left,
        top: item.top,
        width: ITEM_WIDTH
      }}
    >

      <Image src={item.iconPath} alt={'icon'} width={40} height={40}/>

      {
        item.renaming ?
          <textarea
            id={INPUT_ID}
            autoFocus
            onFocus={event => event?.target?.select()}
            value={inputNameValue}
            onChange={handleInputName}
          >            
          </textarea> :
          <div> { formatItemName(item.name) } </div>
      }

    </div>
  );
};

export default DesktopItemComponent;