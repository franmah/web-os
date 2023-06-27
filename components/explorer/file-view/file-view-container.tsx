import { FC, useState } from "react";
import styled from "styled-components";
import { ExplorerFileViewHeader } from "./file-view-header";
import { ExplorerFileViewRow } from "./file-view-row";

export const StyledExplorerFileViewContainer = styled.div`
  user-select: none;
  border-spacing: 0px;
  margin-left: 8px;
  margin-top: 8px;

  .content {
    margin-top: 8px;
  }
`;

export enum ExplorerFileViewSortDirections {
  ASC,
  DESC
};

export enum ExplorerFileViewSortFields {
  NAME,
  DATE_MODIFIED,
  TYPE,
  SIZE
};

const COLUMN_SIZES  = {
  name: '250px',
  dateModified: '200px',
  type: '50px',
  size: '50px'
}

const ExplorerFileViewContainer: FC<{ children: string[] }> = ({ children }) => {

  const [sort, setSorting] = useState<{column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections}>
    ({ column: ExplorerFileViewSortFields.NAME, direction: ExplorerFileViewSortDirections.ASC });
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  const handleFileSelected = (child: string, selected: boolean, unselectAll = false) => {
    if (unselectAll)
      handleSelectAllChildren(false);
    
      setSelectedChildren(currentlySelectedChildren => {
      if (selected)
        return [...currentlySelectedChildren, child];
      else
        return [...currentlySelectedChildren].filter(c => c !== child);
    });
  }

  const handleSelectAllChildren = (selected: boolean) => {
    if (selected)
      setSelectedChildren(children);
    else
      setSelectedChildren([]);
  };

  const handleSortChildren = (column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections) => {
    setSorting({
        column,
        direction
    });
  };

  const sortFn = (child1: string, child2: string) => {
    const leftOperand = sort.direction === ExplorerFileViewSortDirections.ASC ? 1 : -1;
    const rightOperand = sort.direction === ExplorerFileViewSortDirections.ASC ? -1 : 1;

    switch(sort.column) {
      case ExplorerFileViewSortFields.NAME:
        return child1 > child2 ? leftOperand : rightOperand;
      default:
        return 0;
    }
  };

  return (
    <StyledExplorerFileViewContainer>
      <ExplorerFileViewHeader
        columnSizes={COLUMN_SIZES}
        allFilesChecked={selectedChildren.length === children.length}
        sortColumn={sort.column}
        sortDirection={sort.direction}
        onSelectAllChildren={handleSelectAllChildren}
        onSort={handleSortChildren}
      />

      <div className="content">
        {
          children
            ?.sort(sortFn)
            ?.map(child => {
              const isSelected = !!selectedChildren.find(c => c === child);
              return (
                <ExplorerFileViewRow
                  columnSizes={COLUMN_SIZES}
                  key={child}
                  isSelected={isSelected}
                  path={child}
                  onFileSelected={handleFileSelected}
                />
              );
            })
        }
      </div>
      
    </StyledExplorerFileViewContainer>
  )
};

export default ExplorerFileViewContainer;