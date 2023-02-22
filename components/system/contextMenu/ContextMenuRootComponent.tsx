import { FC } from 'react';
import { ContextMenuParams } from '../../../types/system/contextMenu/contextMenuParams';
import ContextMenuComponent, { DEFAULT_WIDTH_SUB_MENU } from './contextMenuComponent';

/**
 * Avoid root context menu to go out of screen.
 * @param params 
 */
const correctRootContextMenuPosition = (params: ContextMenuParams): ContextMenuParams => {
  // top and left are the mouse position.
  const width = params.width || DEFAULT_WIDTH_SUB_MENU;
  const left = params.left + width > window.innerWidth ?
    params.left - width :
    params.left;

  return {
    ...params,
    left
  };
}

const ContextMenuRootComponent: FC<{ params: ContextMenuParams }> = ({ params }) => {

  const { left, top, commands } = correctRootContextMenuPosition(params);

  // Prevent menu from closing when clicking
  const onMouseDown = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <section
      id="contextMenuRoot"
      onMouseDown={onMouseDown}
    >

      <ContextMenuComponent
        params={{
          top,
          left,
          width: DEFAULT_WIDTH_SUB_MENU,
          commands
        }}
      />

    </section>
  );
};

export default ContextMenuRootComponent;
