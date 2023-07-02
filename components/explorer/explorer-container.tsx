import { FC, useContext, useEffect, useState } from "react";
import ExplorerAccessBar from "./access-bar";
import ExplorerFileQuickAccess from "./file-quick-access";
import ExplorerFileViewContainer from "./file-view/file-view-container";
import { FileSystemContext } from "../../contexts/FileSystemContext";
import { StyledExplorerContainer } from "../../styled-components/system/explorer/styled-explorer-container";

const ExplorerContainer: FC<{ params: { startPath: string }}> = ({
  params: { startPath }
}) => {

  const fs = useContext(FileSystemContext);

  const [pathsFlow, setPathsFlow] = useState<string[]>([startPath]);
  const [path, setPath] = useState<string>(startPath);
  const [children, setChildren] = useState<string[]>([]);

  useEffect(() => {
    fs.readdirV2(path)
      .then(files => setChildren(files?.map(child => path + '/' + child) || []));
  }, [path]);
  
  const openFile = (newPath: string) => {
    // TODO: check if folder or app

    const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
    setPathsFlow(flow => [...flow.slice(0, currentPathIndexInFlow + 1), newPath]);
    setPath(newPath);
  }

  const previousFolder = () => {
    const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
    if (currentPathIndexInFlow - 1 >= 0)
      setPath(pathsFlow[currentPathIndexInFlow - 1]);
  }

  const nextFolder = () => {
    const currentPathIndexInFlow = pathsFlow.findIndex(p => p === path);
    if (currentPathIndexInFlow + 1 < pathsFlow.length)
      setPath(pathsFlow[currentPathIndexInFlow + 1]);
  }

  return (
    <StyledExplorerContainer>
      <ExplorerAccessBar
        path={path}
        pathsFlow={pathsFlow}
        updatePath={openFile}
        nextFolder={nextFolder}
        previousFolder={previousFolder}
      />

      <section className="main-content">
        <div className="quick-access">
          <ExplorerFileQuickAccess
            pinnedFolderPaths={[
              '/Desktop',
              '/Documents',
              '/Desktop/num #6'
            ]}
          />
        </div>

        <div className="divider"></div>

        <div className="file-view">
          <ExplorerFileViewContainer
            openFile={openFile}
            paths={children}
          />
        </div>
      </section>

      <footer className="container-footer">
        { children.length ? `${children.length} items` : '' }
      </footer>
    </StyledExplorerContainer>
  );
};

export default ExplorerContainer;