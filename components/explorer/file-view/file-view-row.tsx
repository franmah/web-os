import { FC } from "react";
import Image from 'next/image';
import { convertPathToFragments } from "../../../services/file-system/FilePathService";
import { toDateModifedFormat } from "../../../services/date-service";
import { StyledFileViewRow } from "../../../styled-components/system/explorer/styled-file-view-row";

export const ExplorerFileViewRow: FC<{
  columnSizes: { [column: string]: string }
  isSelected: boolean,
  path: string,
  onFileSelected: (path: string, selected: boolean, unselectAll: boolean) => void
}> = ({
  columnSizes,
  isSelected,
  path,
  onFileSelected
}) => {

  return (
    <StyledFileViewRow
      columnSizes={columnSizes}
      className={isSelected ? 'selected-row' : ''}
      onClick={() => onFileSelected(path, true, true)}
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