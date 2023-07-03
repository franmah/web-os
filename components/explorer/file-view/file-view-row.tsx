import { FC, useContext } from "react";
import Image from 'next/image';
import { convertPathToFragments } from "../../../services/file-system/FilePathService";
import { toDateModifedFormat } from "../../../services/date-service";
import { StyledFileViewRow } from "../../../styled-components/system/explorer/styled-file-view-row";
import { ProcessContext } from "../../../contexts/processContext";
import { PinToQuickAccessCommand } from "../../../System/contextMenuCommands/commands/pinToQuickAccessCommand";
import { ExplorerQuickAccessContext } from "../../../contexts/explorer-quick-access-context";
import { UnpinFromQuickAccessCommand } from "../../../System/contextMenuCommands/commands/unpinFromQuickAccessCommand";

export const ExplorerFileViewRow: FC<{
  columnSizes: { [column: string]: string }
  isSelected: boolean,
  path: string,
  onFileSelected: (path: string, selected: boolean, unselectAll: boolean) => void,
  openFile: (path: string) => void
}> = ({
  columnSizes,
  isSelected,
  path,
  onFileSelected,
  openFile
}) => {

  const { openProcess } = useContext(ProcessContext);
  const quickAccessContext = useContext(ExplorerQuickAccessContext);

  const handleRightClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    // TODO: check if folder or file

    const isPinned = quickAccessContext.getQuickAccessPaths().find(p => p === path);
    const command = isPinned ?
      new UnpinFromQuickAccessCommand(() => quickAccessContext.unpinFromQuickAccess(path)) :
      new PinToQuickAccessCommand(() => quickAccessContext.pinToQuickAccess(path));

    openProcess('contextMenu', {
      top: event.clientY,
      left: event.clientX,
      commands: [command]
    });
  };

  return (
    <StyledFileViewRow
      columnSizes={columnSizes}
      className={isSelected ? 'selected-row' : ''}
      onClick={() => onFileSelected(path, true, true)}
      onDoubleClick={() => openFile(path)}
      onContextMenu={e => handleRightClick(e)}
      selected={isSelected}
    >
      {/* Name */}
      <div className="column name-col">

        <input
          className="select-checkbox"
          type='checkbox'
          checked={isSelected}
          onClick={e => e.stopPropagation()}
          onChange={e => onFileSelected(path, e.target.checked, false)}
        />

        <Image
          src='/icons/folder-icon.png'
          alt='folder icon'
          height={16}
          width={16}
          className="icon"
        />

        { convertPathToFragments(path)?.pop() || 'Error' }

      </div>

      {/* DATE MODIFIED  */}
      <div className="column date-modified-col">{ toDateModifedFormat(new Date()) }</div>

      {/* TYPE */}
      <div className="column type-col">File folder</div>

      {/* SIZE */}
      <div className="column size-col"></div>
    </StyledFileViewRow>
  );
};