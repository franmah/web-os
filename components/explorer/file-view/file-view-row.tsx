import { FC } from "react";
import Image from 'next/image';
import { convertPathToFragments } from "../../../services/file-system/FilePathService";
import { toDateModifedFormat } from "../../../services/date-service";
import styled from "styled-components";

export const StyledFileViewRow = styled.div<{
  columnSizes: { [column: string]: string },
  selected: boolean
}>`
  display: flex;
  background-color: ${({ selected }) => selected ? '#CCE8FF' : 'white'};
  margin-bottom: 8px;
  height: 32px;
  overflow: hidden;

  .column {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 8px 8px;

    &:first-child {
      padding-right: 100px
    }

    .select-checkbox {
      visibility: ${({ selected }) => selected ? 'visible' : 'hidden'};
    }
  }

  .name-col {
    flex: ${({ columnSizes }) => `0 0 ${columnSizes['name']}`  };
    display: flex;
    align-items: center;

    .icon {
      margin: 0px 6px;
    }
  }

  .date-modified-col {
    flex: ${({ columnSizes }) => `0 0 ${columnSizes['dateModified']}` };
  }

  .type-col {
    flex: ${({ columnSizes }) => `0 0 ${columnSizes['type']}`  };
  }

  .size-col {
    flex: ${({ columnSizes }) => `0 0 ${columnSizes['size']}`  };
  }

  &:hover {
    background-color: ${({ selected }) => selected ? '#CCE8FF' : '#E5F3FF'};

    .select-checkbox {
      visibility: visible;
    }
  }
`;

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