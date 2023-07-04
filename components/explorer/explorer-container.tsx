import { FC, useContext, useEffect, useState } from "react";
import ExplorerAccessBar from "./access-bar";
import ExplorerFileQuickAccess from "./file-quick-access";
import ExplorerFileViewContainer from "./file-view/file-view-container";
import { FileSystemContext } from "../../contexts/FileSystemContext";
import { StyledExplorerContainer } from "../../styled-components/system/explorer/styled-explorer-container";
import { convertPathToFragments } from "../../services/file-system/FilePathService";
import { ExplorerQuickAccessContext } from "../../contexts/explorer-quick-access-context";
import { CommonFolderPaths } from "../../constants/system/file-system/CommonFilePaths";

const ExplorerContainer: FC<{ params: { startPath: string }}> = ({
  params: { startPath }
}) => {

  const fs = useContext(FileSystemContext);
  const quickAccessContext = useContext(ExplorerQuickAccessContext);
  
  const [pathsFlow, setPathsFlow] = useState<string[]>([startPath]);
  const [path, setPath] = useState<string>(startPath);
  const [fileViewPaths, setFileViewPaths] = useState<string[]>([]);
  const [useSearchView, setUseSearchView] = useState<boolean>(false);
  const [numItemsSelected, setNumItemsSelected] = useState<number>(0);

  useEffect(() => {
    resetFileViewPathsToCurrentPath();
  }, [path]);

  const resetFileViewPathsToCurrentPath = () => {
    fs.readdirV2(path)
      .then(files => setFileViewPaths(files?.map(child => path === CommonFolderPaths.ROOT ?
        path + child :
        path + '/' + child) || []
      ));
  };

  const openFile = (newPath: string) => {
    // TODO: check if folder or app

    setUseSearchView(false);
    resetFileViewPathsToCurrentPath();

    // TODO: fix newPath starting with // sometimes (following code removes the extra /)
    if (newPath[1] === '/')
      newPath = '/' + newPath.substring(2, newPath.length);

    const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
    setPathsFlow(flow => [...flow.slice(0, currentPathIndexInFlow + 1), newPath]);
    setPath(newPath);
  };

  const previousFolder = () => {
    if (useSearchView) return;

    const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
    if (currentPathIndexInFlow - 1 >= 0)
      setPath(pathsFlow[currentPathIndexInFlow - 1]);
  };

  const nextFolder = () => {
    if (useSearchView) return;
    
    const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
    if (currentPathIndexInFlow + 1 < pathsFlow.length)
      setPath(pathsFlow[currentPathIndexInFlow + 1]);
  };

  const searchFolder = (searchString: string) => {
    if (!searchString || searchString.length === 0) {
      resetFileViewPathsToCurrentPath();
      setUseSearchView(false);
      return;
    }
    
    setUseSearchView(true);
    fs.searchFolderV2(path, searchString)
      .then(paths => setFileViewPaths(paths));
  };

  return (
    <StyledExplorerContainer>
      <ExplorerAccessBar
        path={useSearchView ? `Search Results in ${convertPathToFragments(path).at(-1)}` : path}
        pathsFlow={pathsFlow}
        updatePath={openFile}
        nextFolder={nextFolder}
        previousFolder={previousFolder}
        searchFolder={searchFolder}
        searchView={useSearchView}
      />

      <section className="main-content">
        <div className="quick-access">
          <ExplorerFileQuickAccess
            currentPath={path}
            pinnedFolderPaths={quickAccessContext.getQuickAccessPaths()}
            updatePath={openFile}
          />
        </div>

        <div className="divider"></div>

        <div className="file-view">
          <ExplorerFileViewContainer
            openFile={openFile}
            updateNumSelectedItems={setNumItemsSelected}
            paths={fileViewPaths}
          />
        </div>
      </section>

      <footer className="container-footer">
        <span>{ fileViewPaths.length ? `${fileViewPaths.length} items` : null }</span>
        <span>{ numItemsSelected > 0 ? `${numItemsSelected} items selected` : null }</span>
      </footer>
    </StyledExplorerContainer>
  );
};

export default ExplorerContainer;