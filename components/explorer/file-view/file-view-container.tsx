import { FC, useState } from "react";
import styled from "styled-components";
import Image from 'next/image';
import { ExplorerFileViewHeader } from "./file-view-header";
import { toDateModifedFormat } from "../../../services/date-service";
import { ExplorerFileViewRow } from "./file-view-row";

export const StyledExplorerFileViewContainer = styled.table`
  user-select: none;
  border-spacing: 0px;
  margin-left: 8px;
  margin-top: 8px;

  .row {
    &:hover {
      background-color: #e5f3ff;
    }
  }

  td {
    padding: 6px 4px;
    
    &:first-child {
      padding-right: 100px
    }
  }

  .selected-row {
    background-color: #CCE8FF;

    &:hover {
      background-color: #CCE8FF;
    }
  }

  .first-column {
    display: flex;
    align-items: center;

    .icon {
      margin-right: 2px;
    }
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

// TODO: children should contain full path (will be needed when doing a search and showing files from different folders)
const ExplorerFileViewContainer: FC<{ children: string[] }> = ({ children }) => {

  const [sort, setSorting] = useState<{column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections}>
    ({ column: ExplorerFileViewSortFields.NAME, direction: ExplorerFileViewSortDirections.ASC });
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  const handle = (child: string, selected: boolean) => {
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
        allFilesChecked={selectedChildren.length === children.length}
        sortColumn={sort.column}
        sortDirection={sort.direction}
        onSelectAllChildren={handleSelectAllChildren}
        onSort={handleSortChildren}
      />

      <tbody>
        {
          children
            ?.sort(sortFn)
            ?.map(child => {
              const isSelected = !!selectedChildren.find(c => c === child);
              return (
                <ExplorerFileViewRow
                  key={child}
                  isSelected={isSelected}
                  path={child}
                  onFileSelected={handle}
                />
              );
            })
        }
      </tbody>
      
    </StyledExplorerFileViewContainer>
  )
};

export default ExplorerFileViewContainer;