import { FC } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { ExplorerFileViewSortDirections, ExplorerFileViewSortFields } from "../../../constants/system/explorer/explorer-consts";
import { StyledExplorerFileViewHeader } from "../../../styled-components/system/explorer/styled-file-view-header";

export const ExplorerFileViewHeader: FC<{
  columnSizes: { [column: string]: string },
  allFilesChecked: boolean,
  sortColumn: ExplorerFileViewSortFields,
  sortDirection: ExplorerFileViewSortDirections,
  onSort: (column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections) => void,
  onSelectAllChildren: (selected: boolean) => void,
}> = ({
  columnSizes,
  allFilesChecked,
  sortColumn,
  sortDirection,
  onSort,
  onSelectAllChildren,
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

      {/* TODO: Add column resizing */}
      {/* <Draggable 
        onDrag={onDrag}
      >
        test
      </Draggable> */}

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