import { FC, useEffect, useState } from 'react';
import { ExplorerElement } from '../../../types/ExplorerElement';
import styles from '../desktop.module.scss';

const ELEMNT_HEIGHT = 75;
const ELEMENT_WIDTH = 60;
const WIDTH_OFFSET = 10;
const HEIGHT_OFFSET = 60;

const SHORTENED_NAME_LENGTH = 15;

const DesktopElement: FC<{ element: ExplorerElement }> = ({ element }) => {
  const [position, setPosition] = useState<{ left: number, top: number }>({ left: 10, top: 10});

  // TODO: remove listener when unmount
  useEffect(() => {
    const el = document.getElementById(element.name);
    if (!el) return;

    el.addEventListener('dragend', onDragEnd), false;
    el.addEventListener('click', onClick), false;
    el.addEventListener('dbClick', onDoubleClick), false;

    return () => {
      el.removeEventListener('dragend', onDragEnd), false;
      el.removeEventListener('click', onClick), false;
      el.removeEventListener('dblclick', onDoubleClick), false;
    };

  }, []); // TODO: need use [element]?

  const onDragEnd = (event: any) => {
    // Doesn't work on firefox.
    // TODO: prevent from going out of screen
    const maxWidth = document.body.clientWidth - ELEMENT_WIDTH - WIDTH_OFFSET;
    const maxHeight = window.innerHeight - ELEMNT_HEIGHT - HEIGHT_OFFSET;
    const { clientX, clientY } = event;

    const left = Math.min(Math.max(+clientX, WIDTH_OFFSET), maxWidth);
    const top = Math.min(Math.max(+clientY, 0), maxHeight);
    setPosition({ left, top });

    // 'click' listener not triggered when dragging.
    onClick(event);
  };

  const onClick = (event: any) => {
  };

  const onDoubleClick = (event: any) => {
    // Also trigger 'click' event
  };

  const formatElementName = (name: string): string => name.substring(0, SHORTENED_NAME_LENGTH) + '...';

  return (
    <div id={element.name} draggable="true"
      className={styles.desktopElementContainer}
      style={{left: position.left, top: position.top}}
    >
      { element.icon }
      { formatElementName(element.name) }
    </div>
  );
};

export default DesktopElement;