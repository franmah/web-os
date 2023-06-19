import { FC, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ExplorerAccessBar from "./access-bar";
import ExplorerFileQuickAccess from "./file-quick-access";
import ExplorerFileView from "./file-view";
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
      background-color: #ff000014;
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
  const [numItems, setNumsItems] = useState<number | null>(null);

  useEffect(() => {
    fs.readdirV2(path)
      .then(files => setNumsItems(files?.length));
  }, [path]);

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
          <ExplorerFileView />
        </div>
      </section>

      <footer className="container-footer">
        {/* TODO: test with a folder that has 0 children */}
        { numItems !== null ? `${numItems} items` : '' }
      </footer>
    </StyledExplorerContainer>
  );
};

export default ExplorerContainer;