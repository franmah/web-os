import { FC } from "react";
import styled from "styled-components";
import { ExplorerFileViewSortDirections, ExplorerFileViewSortFields } from "./file-view-container";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export const StyledExplorerFileViewHeader = styled.div<{
  columnSizes: { [column: string]: string }
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow: hidden;

  .name-col {
    flex: ${({ columnSizes }) => `0 0 ${columnSizes['name']}`  };
  }
  
  .date-modified-col {
    flex: ${({ columnSizes }) => `0 0 ${columnSizes['dateModified']}`  };
  }

  .type-col {
    flex: ${({ columnSizes }) => `0 0 ${columnSizes['type']}`  };
  }

  .size-col {
    flex: ${({ columnSizes }) => `0 0 ${columnSizes['size']}`  };
  }

  .column {
    text-align: start;
    color: #515858;
    font-weight: normal;
    padding: 0px 8px;
    border-right: 1px solid #d9d9d9;

    &:first-child {
      padding-right: 100px
    }

    .sort-icon {
      position: relative;
      top: 0px;
      left: 50%;
      width: 1px;
      height: 10px;
      visibility: hidden;
    }

    .active-sort-icon {
      visibility: visible;
    }

    &:hover {
      background-color: #e5f3ff;
    }
  }
`;

export const ExplorerFileViewHeader: FC<{
  columnSizes: { [column: string]: string },
  allFilesChecked: boolean,
  sortColumn: ExplorerFileViewSortFields,
  sortDirection: ExplorerFileViewSortDirections,
  onSort: (column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections) => void,
  onSelectAllChildren: (selected: boolean) => void
}> = ({
  columnSizes,
  allFilesChecked,
  sortColumn,
  sortDirection,
  onSort,
  onSelectAllChildren
}) => {
  
  const sortChildren = (columnName: ExplorerFileViewSortFields) => {
    let direction = ExplorerFileViewSortDirections.ASC;

    if (columnName === sortColumn) {
      direction = sortDirection === ExplorerFileViewSortDirections.ASC ?
        ExplorerFileViewSortDirections.DESC :
        ExplorerFileViewSortDirections.ASC;
    }

    onSort(columnName, direction);
  };
  
  return (
    <StyledExplorerFileViewHeader
      columnSizes={columnSizes}
    >

      {/* NAME */}
      <div className="column name-col" onClick={() => sortChildren(ExplorerFileViewSortFields.NAME)}>
        <div
          className={'sort-icon ' + `${sortColumn === ExplorerFileViewSortFields.NAME ? 'active-sort-icon' : ''}` }
        >
          { sortDirection === ExplorerFileViewSortDirections.ASC ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown /> }
        </div>
        <input
          type='checkbox'
          checked={allFilesChecked}
          onClick={e => e.stopPropagation()} // Avoids triggering column sorting
          onChange={e => onSelectAllChildren(e.target.checked)}
        />
        Name
      </div>

      {/* DATE MODIFIED */}
      <div className="column date-modified-col" onClick={() => sortChildren(ExplorerFileViewSortFields.NAME)}>
          <div
            className={'sort-icon ' + `${sortColumn === ExplorerFileViewSortFields.DATE_MODIFIED ? 'active-sort-icon' : ''}` }
          >
            { sortDirection === ExplorerFileViewSortDirections.ASC ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown /> }
          </div>
          Date modified
      </div>

      {/* TYPE */}
      <div className="column type-col" onClick={() => sortChildren(ExplorerFileViewSortFields.NAME)}>
        <div
          className={'sort-icon ' + `${sortColumn === ExplorerFileViewSortFields.TYPE ? 'active-sort-icon' : ''}` }
        >
          { sortDirection === ExplorerFileViewSortDirections.ASC ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown /> }
        </div>
        Type
      </div>

      {/* SIZE */}
      <div className="column size-col" onClick={() => sortChildren(ExplorerFileViewSortFields.NAME)}>
        <div
          className={'sort-icon ' + `${sortColumn === ExplorerFileViewSortFields.SIZE ? 'active-sort-icon' : ''}` }
        >
          { sortDirection === ExplorerFileViewSortDirections.ASC ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown /> }
        </div>
        Size
      </div>

    </StyledExplorerFileViewHeader>
  );
}