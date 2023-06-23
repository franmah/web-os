import { FC } from "react";
import styled from "styled-components";
import { ExplorerFileViewSortDirections, ExplorerFileViewSortFields } from "./file-view-container";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export const StyledExplorerFileViewHeader = styled.thead`
  th {
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
  allFilesChecked: boolean,
  sortColumn: ExplorerFileViewSortFields,
  sortDirection: ExplorerFileViewSortDirections,
  onSort: (column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections) => void,
  onSelectAllChildren: (selected: boolean) => void
}> = ({
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
    <StyledExplorerFileViewHeader>

      {/* NAME */}
      <tr className="header">
        <th onClick={() => sortChildren(ExplorerFileViewSortFields.NAME)}>
          <div
            className={'sort-icon ' + `${sortColumn === ExplorerFileViewSortFields.NAME ? 'active-sort-icon' : ''}` }
          >
            { sortDirection === ExplorerFileViewSortDirections.ASC ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown /> }
          </div>
          <input
            type='checkbox'
            checked={allFilesChecked}
            onChange={e => { e.stopPropagation(); onSelectAllChildren(e.target.checked) }}
          />
          Name
        </th>

        {/* DATE MODIFIED */}
        <th onClick={() => sortChildren(ExplorerFileViewSortFields.NAME)}>
            <div
              className={'sort-icon ' + `${sortColumn === ExplorerFileViewSortFields.DATE_MODIFIED ? 'active-sort-icon' : ''}` }
            >
              { sortDirection === ExplorerFileViewSortDirections.ASC ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown /> }
            </div>
            Date modified
        </th>

        {/* TYPE */}
        <th onClick={() => sortChildren(ExplorerFileViewSortFields.NAME)}>
          <div
            className={'sort-icon ' + `${sortColumn === ExplorerFileViewSortFields.TYPE ? 'active-sort-icon' : ''}` }
          >
            { sortDirection === ExplorerFileViewSortDirections.ASC ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown /> }
          </div>
          Type
        </th>

        {/* SIZE */}
        <th onClick={() => sortChildren(ExplorerFileViewSortFields.NAME)}>
          <div
            className={'sort-icon ' + `${sortColumn === ExplorerFileViewSortFields.SIZE ? 'active-sort-icon' : ''}` }
          >
            { sortDirection === ExplorerFileViewSortDirections.ASC ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown /> }
          </div>
          Size
        </th>
      </tr>

    </StyledExplorerFileViewHeader>
  );
}