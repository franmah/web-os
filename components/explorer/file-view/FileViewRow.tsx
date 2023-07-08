import { FC, useContext, useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { getCurrentItemNameInPath } from "../../../services/file-system/FilePathService";
import { toDateModifedFormat } from "../../../services/DateService";
import { StyledFileViewRow } from "../../../styled-components/system/explorer/StyledFileViewRow";
import { ProcessContext } from "../../../contexts/ProcessContext";
import { PinToQuickAccessCommand } from "../../../System/contextMenuCommands/commands/pinToQuickAccessCommand";
import { ExplorerQuickAccessContext } from "../../../contexts/ExplorerQuickAccessContext";
import { UnpinFromQuickAccessCommand } from "../../../System/contextMenuCommands/commands/unpinFromQuickAccessCommand";
import { getFolderIcon } from "../../../services/IconService";
import CustomCheckbox from "../../system/CustomCheckbox";
import { ShortcutCommandNames, getShorcutCommand } from "../../../System/contextMenuCommands/shortcut-command-factory";

export const ExplorerFileViewRow: FC<{
  columnSizes: { [column: string]: string }
  isSelected: boolean,
  path: string,
  onFileSelected: (path: string, selected: boolean, unselectAll: boolean) => void,
  openFile: (path: string) => void,
  onRenameItem: (path: string, newName: string) => Promise<void>,
  onDeleteItem: (path: string) => void
}> = ({
  columnSizes,
  isSelected,
  path,
  onFileSelected,
  openFile,
  onRenameItem,
  onDeleteItem
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

    onFileSelected(path, true, true);

    // TODO: check if folder or file

    const shortcutCommands = [
      getShorcutCommand(ShortcutCommandNames.RENAME, () => setEditingName(true), 'rename'),
      getShorcutCommand(ShortcutCommandNames.DELETE, () => onDeleteItem(path), 'delete')
    ];

    const isPinned = quickAccessContext.getQuickAccessPaths().find(p => p === path);
    const command = isPinned ?
      new UnpinFromQuickAccessCommand(() => quickAccessContext.unpinFromQuickAccess(path)) :
      new PinToQuickAccessCommand(() => quickAccessContext.pinToQuickAccess(path));

    openProcess('contextMenu', {
      top: event.clientY,
      left: event.clientX,
      commands: [command],
      shortcutCommands
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

        <CustomCheckbox
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