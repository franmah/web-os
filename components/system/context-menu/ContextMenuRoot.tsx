import { FC } from 'react';
import { correctRootContextMenuPosition } from '../../../services/ContextMenuService';
import { ContextMenuParams } from '../../../types/system/context-menu/ContextMenu';
import ContextMenuComponent, { DEFAULT_WIDTH_SUB_MENU } from './ContextMenu';

export const CONTEXT_MENU_ROOT_ID = 'contextMenuRoot';

const ContextMenuRoot: FC<{ params: ContextMenuParams }> = ({ params }) => {

  const { left, top, commands } = correctRootContextMenuPosition(params);

  return (
    <section
      id={CONTEXT_MENU_ROOT_ID}
    >
      <ContextMenuComponent
        params={{
          commands,
          left,
          shortcutCommands: params.shortcutCommands,
          top,
          width: DEFAULT_WIDTH_SUB_MENU
        }}
      />

    </section>
  );
};

export default ContextMenuRoot;