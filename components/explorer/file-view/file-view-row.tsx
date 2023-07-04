import { FC, LegacyRef, useContext, useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { convertPathToFragments, getCurrentItemNameInPath } from "../../../services/file-system/FilePathService";
import { toDateModifedFormat } from "../../../services/date-service";
import { StyledFileViewRow } from "../../../styled-components/system/explorer/styled-file-view-row";
import { ProcessContext } from "../../../contexts/processContext";
import { PinToQuickAccessCommand } from "../../../System/contextMenuCommands/commands/pinToQuickAccessCommand";
import { ExplorerQuickAccessContext } from "../../../contexts/explorer-quick-access-context";
import { UnpinFromQuickAccessCommand } from "../../../System/contextMenuCommands/commands/unpinFromQuickAccessCommand";
import { getFolderIcon } from "../../../services/icon-service";
import Checkbox from "../../system/custom-checkbox";

export const ExplorerFileViewRow: FC<{
  columnSizes: { [column: string]: string }
  isSelected: boolean,
  path: string,
  onFileSelected: (path: string, selected: boolean, unselectAll: boolean) => void,
  openFile: (path: string) => void,
  onRenameItem: (path: string, newName: string) => Promise<void>
}> = ({
  columnSizes,
  isSelected,
  path,
  onFileSelected,
  openFile,
  onRenameItem
}) => {

  const fileName = getCurrentItemNameInPath(path);

  const { openProcess } = useContext(ProcessContext);
  const quickAccessContext = useContext(ExplorerQuickAccessContext);

  const [editingName, setEditingName] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(getCurrentItemNameInPath(path));

  const inputRef = useRef<any>(null);

  // Select whole name when editing item name
  useEffect(() => {
    if (editingName && inputRef.current)
      inputRef.current?.select();

    if (inputRef)
      document.addEventListener('keyup', onInputEnterKeyPressed);

    return () => document.removeEventListener('keyup', onInputEnterKeyPressed);
  }, [inputRef.current]);

  const onInputEnterKeyPressed = (e: any) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      handleRenameItem();
    }
  }

  const onNameClicked = () => {
    if (isSelected) {
      setEditingName(true);
    }
  };

  const handleRenameItem = () => {
    
    if (!inputRef.current) {
      console.error('Error renaming item. inputRef.current is null: unable to get input value.');
      return;
    }

    const newName = inputRef.current?.value || fileName;
    onRenameItem(path, newName)
      .then(() => setEditingName(false));
  }

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
      <div className="column name-col" onClick={onNameClicked}>

        <Checkbox
          className="select-checkbox"
          checked={isSelected}
          onClick={e => e.stopPropagation()}
          onChange={checked => onFileSelected(path, checked, false)}
        />

        <Image
          src={getFolderIcon(path)}
          alt='folder icon'
          height={16}
          width={16}
          className="icon"
        />

        { 
          editingName ?
            <input
              className="name-input"
              ref={inputRef}
              value={inputValue}
              onBlur={() => handleRenameItem()}
              onChange={e => setInputValue(e.target.value)}
            /> :
            fileName
        }
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