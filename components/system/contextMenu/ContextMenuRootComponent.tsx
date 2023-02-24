import { FC } from 'react';
import { correctRootContextMenuPosition } from '../../../services/contextMenuService';
import { ContextMenuParams } from '../../../types/system/contextMenu/contextMenu';
import ContextMenuComponent, { DEFAULT_WIDTH_SUB_MENU } from './contextMenuComponent';

export const CONTEXT_MENU_ROOT_ID = "contextMenuRoot";

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
