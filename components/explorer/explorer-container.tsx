import { FC, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ExplorerAccessBar from "./access-bar";
import ExplorerFileQuickAccess from "./file-quick-access";
import ExplorerFileViewContainer from "./file-view/file-view-container";
import { FileSystemContext } from "../../contexts/FileSystemContext";

export const StyledExplorerContainer = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .main-content {
    display: flex;
    width: 100%;
    height: 100%;

    .quick-access {
      min-width: 200px;
    }

    .divider {
      border-left: 1px solid #F9F9F9;
    }

    .file-view {
      flex: 1;
    }
  }

  .container-footer {
    padding-left: 8px;
    width: 100%;
    user-select: none;
  }
`;

const ExplorerContainer: FC<{ params: { startPath: string }}> = ({
  params: { startPath }
}) => {

  const fs = useContext(FileSystemContext);

  const [path, setPath] = useState<string>(startPath);
  const [children, setChildren] = useState<string[]>([]);

  useEffect(() => {
    fs.readdirV2(path)
      .then(files => setChildren(files || []));
  }, [path]);
  
  const updatePath = (newPath: string) => {
    setPath(newPath);
  }

  return (
    <StyledExplorerContainer>
      <ExplorerAccessBar path={path} />
      
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
            children={children}
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