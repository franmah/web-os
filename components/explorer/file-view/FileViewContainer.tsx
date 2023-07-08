import { FC, useEffect, useState } from "react";
import { ExplorerFileViewHeader } from "./FileViewHeader";
import { ExplorerFileViewRow } from "./FileViewRow";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../../services/EventService";
import { StyledExplorerFileViewContainer } from "../../../styled-components/system/explorer/StyledFileViewContainer";
import { ExplorerFileViewSortDirections, ExplorerFileViewSortFields, START_COLUMN_SIZES } from "../../../constants/system/explorer/Explorer";

export const FILE_VIEW_CONTAINER_ROWS_HTML_ID = 'file-view-container-rows';

const ExplorerFileViewContainer: FC<{
  paths: string[],
  openFile: (path: string) => void,
  updateNumSelectedItems: (number: number) => void,
  onRenameItem: (path: string, newName: string) => Promise<void>,
  onDeleteItem: (path: string) => void
}> = ({ paths, openFile, updateNumSelectedItems, onRenameItem, onDeleteItem }) => {
  
  const [sort, setSorting] = useState<{column: ExplorerFileViewSortFields, direction: ExplorerFileViewSortDirections}>
    ({ column: ExplorerFileViewSortFields.NAME, direction: ExplorerFileViewSortDirections.ASC });
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  useEffect(() => {
    setSelectedChildren([]);
    updateNumSelectedItems(0);    
  }, [paths]);

  useEffect(() => {
    document.addEventListener('click', (e) => handleUnselectOnClick(e));
    () => {
      document.removeEventListener('click', (e) => handleUnselectOnClick(e))
    }
  }, [paths]);
  
  const handleUnselectOnClick = (event: MouseEvent) => {
    if (!isEventOriginatedFromWithinTargetIdSubtree(event, FILE_VIEW_CONTAINER_ROWS_HTML_ID)) {
      handleSelectAllChildren(false);
    }
  };

  const handleFileSelected = (child: string, selected: boolean, unselectAll = false) => {
    if (unselectAll) {
      handleSelectAllChildren(false);
    }
    
    setSelectedChildren(currentlySelectedChildren => {
      if (selected) {
        updateNumSelectedItems(currentlySelectedChildren.length + 1)
        return [...currentlySelectedChildren, child];
      } else {
        const selectedChildren = [...currentlySelectedChildren].filter(c => c !== child);
        updateNumSelectedItems(selectedChildren.length)
        return selectedChildren;
      }
    });
  };

  const handleSelectAllChildren = (selected: boolean) => {
    if (selected) {
      setSelectedChildren(paths);
      updateNumSelectedItems(paths.length);
    } else {
      setSelectedChildren([]);
      updateNumSelectedItems(0);
    }
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
      {
        paths.length > 0 ?
          <ExplorerFileViewHeader
            columnSizes={START_COLUMN_SIZES}
            allFilesChecked={selectedChildren.length === paths.length && paths.length > 0}
            sortColumn={sort.column}
            sortDirection={sort.direction}
            onSelectAllChildren={handleSelectAllChildren}
            onSort={handleSortChildren}
          /> :
          null
      }  

      { 
        paths.length === 0 ? 
          <div className='empty-folder-text'>This folder is empty.</div> :
          null
      }

      <div id={FILE_VIEW_CONTAINER_ROWS_HTML_ID}>
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
                  onRenameItem={onRenameItem}
                  onDeleteItem={onDeleteItem}
                />
              );
            })
        }
      </div>
      
    </StyledExplorerFileViewContainer>
  )
};

export default ExplorerFileViewContainer;