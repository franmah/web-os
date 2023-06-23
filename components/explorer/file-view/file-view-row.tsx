import { FC } from "react";
import Image from 'next/image';
import { convertPathToFragments } from "../../../services/file-system/FilePathService";
import { toDateModifedFormat } from "../../../services/date-service";
import styled from "styled-components";

export const StyledFileViewRow = styled.tr<{
  selected: boolean
}>`
  background-color: ${({ selected }) => selected ? '#CCE8FF' : 'white'};

  &:hover {
    background-color: ${({ selected }) => selected ? '#CCE8FF' : '#E5F3FF'};
  }

  td {
    padding: 8px 8px;

    &:first-child {
      padding-right: 100px
    }
  }

  .first-column {
    display: flex;
    align-items: center;

    .icon {
      margin: 0px 6px;

    }
  }
`;

export const ExplorerFileViewRow: FC<{
  isSelected: boolean,
  path: string,
  onFileSelected: (path: string, selected: boolean, unselectAll: boolean) => void
}> = ({
  isSelected,
  path,
  onFileSelected
}) => {
  
  return (
    <StyledFileViewRow
      className={isSelected ? 'selected-row' : ''}
      onClick={() => onFileSelected(path, true, true)}
      selected={isSelected}
    >
      {/* Name */}
      <td className="first-column">

        <input
          type='checkbox'
          checked={isSelected}
          onClick={e => e.stopPropagation()}
          onChange={e => onFileSelected(path, e.target.checked, false)}
        />

        <Image
          src='/icons/folder-icon.png'
          alt='folder icon'
          height={23}
          width={23}
          className="icon"
        />

        { convertPathToFragments(path)?.pop() || 'Error' }

      </td>

      {/* DATE MODIFIED  */}
      <td>{ toDateModifedFormat(new Date()) }</td>

      {/* TYPE */}
      <td>File folder</td>

      {/* SIZE */}
      <td></td>
    </StyledFileViewRow>
  );
};