import { FC, useEffect, useState } from "react";
import { ExplorerFileViewHeader } from "./file-view-header";
import { ExplorerFileViewRow } from "./file-view-row";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../../services/EventService";
import { StyledExplorerFileViewContainer } from "../../../styled-components/system/explorer/styled-file-view-container";
import { ExplorerFileViewSortDirections, ExplorerFileViewSortFields, START_COLUMN_SIZES } from "../../../constants/system/explorer/explorer-consts";

const ExplorerFileViewContainer: FC<{
  paths: string[],
  openFile: (path: string) => void
}> = ({ paths, openFile }) => {

  const [sort, setSorting] = useState<{column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections}>
    ({ column: ExplorerFileViewSortFields.NAME, direction: ExplorerFileViewSortDirections.ASC });
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  useEffect(() => {
    document.addEventListener('click', (e) => handleUnselectOnClick(e));
    () => {
      document.removeEventListener('click', (e) => handleUnselectOnClick(e))
    }
  }, [paths]);
  
  const handleUnselectOnClick = (event: MouseEvent) => {
    if (!isEventOriginatedFromWithinTargetIdSubtree(event, 'file-view-container-rows')) {
      handleSelectAllChildren(false);
    }
  };

  const handleFileSelected = (child: string, selected: boolean, unselectAll = false) => {
    if (unselectAll)
      handleSelectAllChildren(false);
    
      setSelectedChildren(currentlySelectedChildren => {
      if (selected)
        return [...currentlySelectedChildren, child];
      else
        return [...currentlySelectedChildren].filter(c => c !== child);
    });
  };

  const handleSelectAllChildren = (selected: boolean) => {
    if (selected)
      setSelectedChildren(paths);
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
        columnSizes={START_COLUMN_SIZES}
        allFilesChecked={selectedChildren.length === paths.length && paths.length > 0}
        sortColumn={sort.column}
        sortDirection={sort.direction}
        onSelectAllChildren={handleSelectAllChildren}
        onSort={handleSortChildren}
      />

      <div id="file-view-container-rows">
        {
          paths
            ?.sort(sortFn)
            ?.map(child => {
              const isSelected = !!selectedChildren.find(c => c === child);
              return (
                <ExplorerFileViewRow
                  columnSizes={START_COLUMN_SIZES}
                  key={child}
                  isSelected={isSelected}
                  path={child}
                  onFileSelected={handleFileSelected}
                  openFile={openFile}
                />
              );
            })
        }
      </div>
      
    </StyledExplorerFileViewContainer>
  )
};

export default ExplorerFileViewContainer;